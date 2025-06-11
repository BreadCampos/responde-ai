// src/application/stores/use-auth-store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserModel } from "../model/user.model";
import type { CompanyModel } from "../../company/model/company.mode";

interface AuthState {
  user: UserModel | null;
  company: CompanyModel | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setSession: (data: {
    user: UserModel;
    company: CompanyModel;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setSession: (data) => {
        set({
          user: data.user,
          company: data.company,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          company: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
