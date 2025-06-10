import { Route, Routes } from "react-router-dom";

import type { IRoute } from "./types/route-types";
import { LayoutConfig } from "./types/layout-config";
import ProtectRoute from "@/application/shared/components/protect-route/protect-route";

export const makeRoutes = (routes: IRoute[]) => {
  return (
    <Routes>
      {routes.map((route) => {
        const Layout = LayoutConfig[route.layout].component;

        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectRoute
                Layout={Layout}
                private={route.private ?? false}
                element={route.element}
                route={route}
              />
            }
          />
        );
      })}
    </Routes>
  );
};
