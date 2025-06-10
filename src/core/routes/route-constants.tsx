export const ROUTES = {
  LOGIN: "/login",
  LOGOUT: "/logout",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
