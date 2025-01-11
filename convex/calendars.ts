/**
 * Calendar operations for managing user calendars and their associated habits/completions.
 * Provides CRUD operations and data import/export functionality.
 */
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

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
      .order("desc")
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
        if (currentPosition >= newPosition && currentPosition < oldPosition) {
          // Moving up: increment positions of calendars in between
          await ctx.db.patch(otherCalendar._id, { position: currentPosition + 1 });
        } else if (currentPosition <= newPosition && currentPosition > oldPosition) {
          // Moving down: decrement positions of calendars in between
          await ctx.db.patch(otherCalendar._id, { position: currentPosition - 1 });
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
 * Exports all user's calendars with their habits and completions.
 * Structure:
 * {
 *   calendars: [{
 *     name: string,
 *     colorTheme: string,
 *     habits: [{
 *       name: string,
 *       completions: [{ completedAt: number }]
 *     }]
 *   }]
 * }
 */
export const exportData = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return null;

      const calendars = await ctx.db
        .query("calendars")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .collect();

      const result = await Promise.all(
        calendars.map(async (calendar) => {
          try {
            const habits = await ctx.db
              .query("habits")
              .filter((q) => q.eq(q.field("calendarId"), calendar._id))
              .collect();

            const habitsWithCompletions = await Promise.all(
              habits.map(async (habit) => {
                try {
                  const completions = await ctx.db
                    .query("completions")
                    .filter((q) => q.eq(q.field("habitId"), habit._id))
                    .collect();

                  return {
                    name: habit.name,
                    position: habit.position,
                    timerDuration: habit.timerDuration,
                    completions: completions.map((c) => ({
                      completedAt: c.completedAt,
                    })),
                  };
                } catch (error) {
                  console.error(`Error fetching completions for habit ${habit._id}:`, error);
                  return {
                    name: habit.name,
                    position: habit.position,
                    timerDuration: habit.timerDuration,
                    completions: [],
                  };
                }
              })
            );

            return {
              name: calendar.name,
              colorTheme: calendar.colorTheme,
              position: calendar.position,
              habits: habitsWithCompletions,
            };
          } catch (error) {
            console.error(`Error processing calendar ${calendar._id}:`, error);
            return {
              name: calendar.name,
              colorTheme: calendar.colorTheme,
              position: calendar.position,
              habits: [],
            };
          }
        })
      );

      return { calendars: result };
    } catch (error) {
      console.error("Error in exportData:", error);
      throw error;
    }
  },
});

/**
 * Imports calendar data with habits and completions.
 * For existing calendars (matched by name):
 * - Updates the calendar's color theme
 * - Adds new habits or updates existing ones
 * - Adds only new completions (avoids duplicates)
 *
 * For new calendars:
 * - Creates the calendar with all habits and completions
 */
export const importData = mutation({
  args: {
    data: v.object({
      calendars: v.array(
        v.object({
          name: v.string(),
          colorTheme: v.string(),
          position: v.optional(v.number()),
          habits: v.array(
            v.object({
              name: v.string(),
              timerDuration: v.optional(v.number()),
              position: v.optional(v.number()),
              completions: v.array(
                v.object({
                  completedAt: v.number(),
                })
              ),
            })
          ),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get existing calendars for matching
    const existingCalendars = await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // Sort imported calendars by position
    const sortedCalendars = [...args.data.calendars].sort(
      (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity)
    );

    for (const calendarData of sortedCalendars) {
      const existingCalendar = existingCalendars.find((cal) => cal.name === calendarData.name);
      const calendarId = existingCalendar?._id;

      if (calendarId) {
        // Update existing calendar
        await ctx.db.patch(calendarId, {
          colorTheme: calendarData.colorTheme,
          position: calendarData.position,
        });

        // Get existing habits for matching
        const existingHabits = await ctx.db
          .query("habits")
          .filter((q) => q.eq(q.field("calendarId"), calendarId))
          .collect();

        // Sort imported habits by position
        const sortedHabits = [...calendarData.habits].sort(
          (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity)
        );

        // Import habits
        for (const habitData of sortedHabits) {
          const { name, completions, timerDuration, position } = habitData;

          // Find or create habit
          const existingHabit = existingHabits.find((h) => h.name === name);
          let habitId: Id<"habits">;

          if (existingHabit) {
            habitId = existingHabit._id;
            // Update existing habit with position
            await ctx.db.patch(habitId, {
              position: position ?? existingHabits.indexOf(existingHabit) + 1,
              timerDuration,
            });
          } else {
            // Create new habit with position
            habitId = await ctx.db.insert("habits", {
              name,
              userId: identity.subject,
              calendarId,
              timerDuration,
              position: position ?? existingHabits.length + 1,
            });
          }

          // Get existing completions to avoid duplicates
          const existingCompletions = await ctx.db
            .query("completions")
            .filter((q) => q.eq(q.field("habitId"), habitId))
            .collect();

          // Add only new completions
          for (const completion of completions) {
            const exists = existingCompletions.some((ec) => ec.completedAt === completion.completedAt);

            if (!exists) {
              await ctx.db.insert("completions", {
                habitId,
                userId: identity.subject,
                completedAt: completion.completedAt,
              });
            }
          }
        }
      } else {
        // Create new calendar with position
        const newCalendarId = await ctx.db.insert("calendars", {
          name: calendarData.name,
          userId: identity.subject,
          colorTheme: calendarData.colorTheme,
          position: calendarData.position ?? existingCalendars.length + 1,
        });

        // Sort habits by position before creating
        const sortedHabits = [...calendarData.habits].sort(
          (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity)
        );

        for (const habitData of sortedHabits) {
          const { name, completions, timerDuration, position } = habitData;

          const habitId = await ctx.db.insert("habits", {
            name,
            userId: identity.subject,
            calendarId: newCalendarId,
            timerDuration,
            position: position ?? calendarData.habits.indexOf(habitData) + 1,
          });

          for (const completion of completions) {
            await ctx.db.insert("completions", {
              habitId,
              userId: identity.subject,
              completedAt: completion.completedAt,
            });
          }
        }
      }
    }
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
