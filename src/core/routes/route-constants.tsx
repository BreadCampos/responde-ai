export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  LOGOUT: "/logout",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
