import { authenticationRoutes } from "@/application/feature/authentication/router";
import type { IRoute } from "./types/route-types";

export const useMakeRoutes = (): IRoute[] => {
  return [...authenticationRoutes];
};
