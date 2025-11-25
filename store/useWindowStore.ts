import { create } from "zustand";

interface WindowState {
  width: number;
  setWidth: (width: number) => void;
}

export const useWindowStore = create<WindowState>((set) => ({
  width: typeof window !== "undefined" ? window.innerWidth : 0,
  setWidth: (width) => set({ width }),
}));
