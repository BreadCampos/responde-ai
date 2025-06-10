import AuthFormLayout from "@/application/shared/layout/auth-form-layout/auth-form-layout";
import DefaultLayout from "@/application/shared/layout/default-layout/default-layout";

export const LayoutConfig = {
  DefaultLayout: {
    name: "DefaultLayout",
    component: DefaultLayout,
  },

  AuthFormLayout: {
    name: "AuthFormLayout",
    component: AuthFormLayout,
  },
} as const;
