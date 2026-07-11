import { create } from "zustand";

interface AppState {
  progress: number;
  hasEnteredHero: boolean;
  scrollProgress: number;
  setProgress: (progress: number) => void;
  finishLoading: () => void;
  setScrollProgress: (progress: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  progress: 0,
  hasEnteredHero: false,
  scrollProgress: 0,
  setProgress: (progress) => set({ progress }),
  finishLoading: () => set({ hasEnteredHero: true }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
}));
