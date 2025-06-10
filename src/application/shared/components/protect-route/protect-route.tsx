import react from "react";
import { Navigate, type RouteProps } from "react-router-dom";

import type { IRoute } from "@/core/routes/types/route-types";
import { ROUTES } from "@/core/routes/route-constants";

type Props = RouteProps & {
  private: boolean;
  Layout: react.ElementType;
  route: IRoute;
};

const ProtectRoute = ({ private: isPrivate, Layout, element }: Props) => {
  // const { isAuthenticated } = useAuth();

  const isAuthenticated = false;

  const redirect = ROUTES?.LOGIN;

  if (!element) return <Navigate to={redirect} />;
  if (isPrivate) {
    return (
      <Layout>
        {isAuthenticated ? <>{element}</> : <Navigate to={redirect} />}
      </Layout>
    );
  }

  return <Layout>{element}</Layout>;
};

export default react.memo(ProtectRoute);
