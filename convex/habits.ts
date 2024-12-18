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
    });
  },
});

export const markComplete = mutation({
  args: {
    habitId: v.id("habits"),
    completedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify habit belongs to user
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error("Habit not found");
    }

    // Check if completion already exists for this date
    const existingCompletion = await ctx.db
      .query("completions")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .filter((q) => q.eq(q.field("completedAt"), args.completedAt))
      .first();

    if (existingCompletion) {
      // If completion exists, remove it (toggle off)
      await ctx.db.delete(existingCompletion._id);
      return null;
    }

    // Otherwise, create new completion
    return await ctx.db.insert("completions", {
      habitId: args.habitId,
      userId: identity.subject,
      completedAt: args.completedAt,
    });
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

    return await ctx.db
      .query("completions")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .filter((q) => q.and(q.gte(q.field("completedAt"), args.startDate), q.lte(q.field("completedAt"), args.endDate)))
      .collect();
  },
});

export const update = mutation({
  args: { id: v.id("habits"), name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const habit = await ctx.db.get(args.id);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
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
