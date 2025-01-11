import { mutation } from "./_generated/server";

export const addPositionsToHabits = mutation({
  handler: async (ctx) => {
    // Get all habits without positions
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("position"), undefined))
      .collect();

    // Group habits by calendar
    const habitsByCalendar = habits.reduce(
      (acc, habit) => {
        const calendarId = habit.calendarId;
        if (!acc[calendarId]) {
          acc[calendarId] = [];
        }
        acc[calendarId].push(habit);
        return acc;
      },
      {} as Record<string, typeof habits>
    );

    // Update positions for each calendar's habits
    for (const calendarHabits of Object.values(habitsByCalendar)) {
      for (let i = 0; i < calendarHabits.length; i++) {
        await ctx.db.patch(calendarHabits[i]._id, {
          position: i + 1,
        });
      }
    }

    return `Updated positions for ${habits.length} habits`;
  },
});
