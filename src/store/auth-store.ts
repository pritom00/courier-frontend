import { create } from "zustand";
import type { SessionUser } from "@/lib/types";

interface AuthState {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
}

/** Global client-side identity (name shown in header/sidebar updates instantly after a profile edit). */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
