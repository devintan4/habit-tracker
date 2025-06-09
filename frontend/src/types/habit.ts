export interface HabitDto {
  id: string;
  name: string;
  frequency: number;
  reminderOn: boolean;
  currentStreak: number;
  longestStreak: number;
  completedCountToday: number;
  isDoneToday: boolean;
}

export interface CreateHabitDto {
  name: string;
  frequency: number;
  reminderOn: boolean;
}

export interface UpdateHabitDto extends CreateHabitDto {}
