import { create } from 'zustand';
import api from '../api/client';
import {
  HabitDto,
  CreateHabitDto,
  UpdateHabitDto
} from '../types/habit';

interface HabitState {
  habits: HabitDto[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  fetchOne: (id: string) => Promise<HabitDto | undefined>;
  create: (h: CreateHabitDto) => Promise<void>;
  update: (id: string, h: UpdateHabitDto) => Promise<void>;
  remove: (id: string) => Promise<void>;
  markDone: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const { data } = await api.get<HabitDto[]>('/habits');
    set({ habits: data, loading: false });
  },

  fetchOne: async (id) => {
    const { data } = await api.get<HabitDto>(`/habits/${id}`);
    // optionally merge with list
    return data;
  },

  create: async (h) => {
    const { data } = await api.post<HabitDto>('/habits', h);
    set((s) => ({ habits: [...s.habits, data] }));
  },

  update: async (id, h) => {
    await api.put(`/habits/${id}`, h);
    // refresh list
    await get().fetchAll();
  },

  remove: async (id) => {
    await api.delete(`/habits/${id}`);
    set((s) => ({
      habits: s.habits.filter((x) => x.id !== id)
    }));
  },

  markDone: async (id) => {
    // kebutuhan backend: POST /api/habits/{id}/logs
    await api.post(`/habits/${id}/logs`);
    // refresh to get updated streaks
    await get().fetchAll();
  }
}));
