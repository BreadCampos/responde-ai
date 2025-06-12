import { authenticationRoutes } from "@/application/feature/authentication/router";
import type { IRoute } from "./types/route-types";
import { dashboardRoutes } from "@/application/feature/dashboard/router";

export const useMakeRoutes = (): IRoute[] => {
  return [...authenticationRoutes, ...dashboardRoutes];
};
