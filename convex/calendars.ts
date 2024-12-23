import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

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

export const create = mutation({
  args: {
    name: v.string(),
    colorTheme: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.insert("calendars", {
      name: args.name,
      userId: identity.subject,
      colorTheme: args.colorTheme,
    });
  },
});

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

    // Finally delete the calendar
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("calendars"), name: v.string(), colorTheme: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const calendar = await ctx.db.get(args.id);
    if (!calendar || calendar.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      colorTheme: args.colorTheme,
    });
  },
});

export const exportData = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const calendars = await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const result = [];

    for (const calendar of calendars) {
      const habits = await ctx.db
        .query("habits")
        .filter((q) => q.eq(q.field("calendarId"), calendar._id))
        .collect();

      const habitsWithCompletions = await Promise.all(
        habits.map(async (habit) => {
          const completions = await ctx.db
            .query("completions")
            .filter((q) => q.eq(q.field("habitId"), habit._id))
            .collect();

          return {
            name: habit.name,
            completions: completions.map((c) => ({
              completedAt: c.completedAt,
            })),
          };
        })
      );

      result.push({
        name: calendar.name,
        colorTheme: calendar.colorTheme,
        habits: habitsWithCompletions,
      });
    }

    return { calendars: result };
  },
});

export const importData = mutation({
  args: {
    data: v.object({
      calendars: v.array(
        v.object({
          name: v.string(),
          colorTheme: v.string(),
          habits: v.array(
            v.object({
              name: v.string(),
              targetFrequency: v.optional(v.number()),
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

    const existingCalendars = await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    for (const calendarData of args.data.calendars) {
      const existingCalendar = existingCalendars.find((cal) => cal.name === calendarData.name);
      const calendarId = existingCalendar?._id;

      if (calendarId) {
        // Update existing calendar
        await ctx.db.patch(calendarId, {
          colorTheme: calendarData.colorTheme,
        });

        // Get existing habits for matching
        const existingHabits = await ctx.db
          .query("habits")
          .filter((q) => q.eq(q.field("calendarId"), calendarId))
          .collect();

        // Import habits
        for (const habitData of calendarData.habits) {
          // Get only the needed fields
          const { name, completions } = habitData;

          // Find or create habit
          const existingHabit = existingHabits.find((h) => h.name === name);
          const habitId =
            existingHabit?._id ||
            (await ctx.db.insert("habits", {
              name,
              userId: identity.subject,
              calendarId,
            }));

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
        // Create new calendar if it doesn't exist
        const newCalendarId = await ctx.db.insert("calendars", {
          name: calendarData.name,
          userId: identity.subject,
          colorTheme: calendarData.colorTheme,
        });

        // Create all habits and completions for new calendar
        for (const habitData of calendarData.habits) {
          const { name, completions } = habitData;

          const habitId = await ctx.db.insert("habits", {
            name,
            userId: identity.subject,
            calendarId: newCalendarId,
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
