export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
