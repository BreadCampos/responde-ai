import type { IRoute } from "@/core/routes/types/route-types";
import { LoginScreen } from "../screen/login";
import { ROUTES } from "@/core/routes/route-constants";
import { Register } from "../screen/register";

export const authenticationRoutes: IRoute[] = [
  {
    element: <LoginScreen />,

    name: "Login",
    path: ROUTES.LOGIN,
    layout: "AuthFormLayout",
    roles: [],

    private: false,
  },
  {
    element: <Register />,
    name: "Register",
    layout: "AuthFormLayout",
    roles: [],
    private: false,
    path: ROUTES.REGISTER,
  },
];
