import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    calendarId: v.optional(v.id("calendars")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    let q = ctx.db.query("habits").filter((q) => q.eq(q.field("userId"), identity.subject));

    if (args.calendarId) {
      q = q.filter((q) => q.eq(q.field("calendarId"), args.calendarId));
    }

    return await q.collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    calendarId: v.id("calendars"),
    timerDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify calendar belongs to user
    const calendar = await ctx.db.get(args.calendarId);
    if (!calendar || calendar.userId !== identity.subject) {
      throw new Error("Calendar not found");
    }

    return await ctx.db.insert("habits", {
      name: args.name,
      userId: identity.subject,
      calendarId: args.calendarId,
      timerDuration: args.timerDuration,
    });
  },
});

export const markComplete = mutation({
  args: {
    habitId: v.id("habits"),
    completedAt: v.number(),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify habit belongs to user
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error("Habit not found");
    }

    // Get all completions for this habit on this date
    const date = new Date(args.completedAt);
    date.setHours(0, 0, 0, 0);
    const startOfDay = date.getTime();
    date.setHours(23, 59, 59, 999);
    const endOfDay = date.getTime();

    const existingCompletions = await ctx.db
      .query("completions")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .filter((q) => q.and(q.gte(q.field("completedAt"), startOfDay), q.lte(q.field("completedAt"), endOfDay)))
      .collect();

    const currentCount = existingCompletions.length;
    // If count is provided, use it directly. Otherwise increment by 1
    const targetCount = args.count ?? currentCount + 1;

    if (targetCount < currentCount) {
      // Remove completions from the end until we reach target count
      const numToRemove = currentCount - targetCount;
      const toRemove = existingCompletions.slice(-numToRemove);
      await Promise.all(toRemove.map((completion) => ctx.db.delete(completion._id)));
    } else if (targetCount > currentCount) {
      // Add new completions
      const newCompletions = Array.from({ length: targetCount - currentCount }, () => ({
        habitId: args.habitId,
        userId: identity.subject,
        completedAt: startOfDay, // Use start of day for consistency
      }));
      await Promise.all(newCompletions.map((completion) => ctx.db.insert("completions", completion)));
    }

    return null;
  },
});

export const getCompletions = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Use the compound index for more efficient querying
    return await ctx.db
      .query("completions")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", identity.subject).gte("completedAt", args.startDate).lte("completedAt", args.endDate)
      )
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("habits"),
    name: v.string(),
    timerDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const habit = await ctx.db.get(args.id);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      timerDuration: args.timerDuration,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const habit = await ctx.db.get(args.id);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    // Delete all completions for this habit
    const completions = await ctx.db
      .query("completions")
      .filter((q) => q.eq(q.field("habitId"), args.id))
      .collect();

    await Promise.all(completions.map((completion) => ctx.db.delete(completion._id)));

    // Delete the habit
    await ctx.db.delete(args.id);
  },
});

export const get = query({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.id);
    if (!habit) throw new Error("Habit not found");
    return habit;
  },
});
