import { ROUTES } from "@/core/routes/route-constants";
import type { IRoute } from "@/core/routes/types/route-types";
import { Dashboard } from "..";

export const dashboardRoutes: IRoute[] = [
  {
    element: <Dashboard />,
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
    layout: "DefaultLayout",
    roles: [],
    private: true,
  },
];
