export type Id<T extends string> = string & { __tableName: T };

export interface Calendar {
  _id: Id<"calendars">;
  _creationTime: number;
  name: string;
  colorTheme: string;
  userId: string;
  position?: number;
}

export interface Habit {
  _id: Id<"habits">;
  _creationTime: number;
  name: string;
  calendarId: Id<"calendars">;
  userId: string;
}

export interface Completion {
  _id: Id<"completions">;
  _creationTime: number;
  habitId: Id<"habits">;
  completedAt: number;
  userId: string;
}

export type Day = string;

export type EditingCalendar = Pick<Calendar, "_id" | "name" | "colorTheme" | "position">;
export type EditingHabit = Pick<Habit, "_id" | "name">;
