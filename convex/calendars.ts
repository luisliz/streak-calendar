import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

/**
 * Calendar operations for managing user calendars and their associated habits/completions.
 * Import/Export functionality has been moved to calendar-sync.ts
 */

/**
 * Retrieves all calendars for the authenticated user, ordered by most recent first.
 */
export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("asc")
      .collect();
  },
});

/**
 * Creates a new calendar with specified name and color theme.
 */
export const create = mutation({
  args: {
    name: v.string(),
    colorTheme: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get existing calendars to determine position
    const existingCalendars = await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    return await ctx.db.insert("calendars", {
      name: args.name,
      userId: identity.subject,
      colorTheme: args.colorTheme,
      position: existingCalendars.length + 1,
    });
  },
});

/**
 * Removes a calendar and cascades deletion to all associated habits and completions.
 * Follows this order:
 * 1. Delete all completions for each habit
 * 2. Delete all habits in the calendar
 * 3. Delete the calendar itself
 */
export const remove = mutation({
  args: {
    id: v.id("calendars"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const calendar = await ctx.db.get(args.id);
    if (!calendar || calendar.userId !== identity.subject) {
      throw new Error("Calendar not found");
    }

    // Delete associated habits first
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("calendarId"), args.id))
      .collect();

    for (const habit of habits) {
      // Delete completions for each habit
      await ctx.db
        .query("completions")
        .filter((q) => q.eq(q.field("habitId"), habit._id))
        .collect()
        .then((completions) => {
          return Promise.all(completions.map((completion) => ctx.db.delete(completion._id)));
        });

      // Delete the habit
      await ctx.db.delete(habit._id);
    }

    // Get all calendars to update positions
    const allCalendars = await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const deletedPosition = calendar.position ?? allCalendars.length;

    // Update positions of calendars after the deleted one
    for (const otherCalendar of allCalendars) {
      if (otherCalendar._id === args.id) continue;

      const currentPosition = otherCalendar.position ?? allCalendars.length;
      if (currentPosition > deletedPosition) {
        await ctx.db.patch(otherCalendar._id, { position: currentPosition - 1 });
      }
    }

    // Finally delete the calendar
    await ctx.db.delete(args.id);
  },
});

/**
 * Updates a calendar's name and color theme after verifying ownership.
 */
export const update = mutation({
  args: {
    id: v.id("calendars"),
    name: v.string(),
    colorTheme: v.string(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const calendar = await ctx.db.get(args.id);
    if (!calendar || calendar.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    // Get all calendars to handle position updates
    const allCalendars = await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // If position changed, update other calendars' positions
    if (calendar.position !== args.position) {
      const oldPosition = calendar.position ?? allCalendars.length;
      const newPosition = args.position;

      // Update positions of other calendars
      for (const otherCalendar of allCalendars) {
        if (otherCalendar._id === args.id) continue;

        const currentPosition = otherCalendar.position ?? allCalendars.length;
        if (oldPosition < newPosition) {
          // Moving down: decrement positions of calendars in between
          if (currentPosition > oldPosition && currentPosition <= newPosition) {
            await ctx.db.patch(otherCalendar._id, { position: currentPosition - 1 });
          }
        } else {
          // Moving up: increment positions of calendars in between
          if (currentPosition >= newPosition && currentPosition < oldPosition) {
            await ctx.db.patch(otherCalendar._id, { position: currentPosition + 1 });
          }
        }
      }
    }

    // Update the calendar itself
    await ctx.db.patch(args.id, {
      name: args.name,
      colorTheme: args.colorTheme,
      position: args.position,
    });
  },
});

/**
 * Retrieves a single calendar by ID after verifying it exists.
 */
export const get = query({
  args: { id: v.id("calendars") },
  handler: async (ctx, args) => {
    const calendar = await ctx.db.get(args.id);
    if (!calendar) throw new Error("Calendar not found");
    return calendar;
  },
});
