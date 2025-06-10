import type { LayoutConfig } from "./layout-config";
import { ROUTES } from "@/core/routes/route-constants";

export type IRoute = {
  name: string;
  path: (typeof ROUTES)[keyof typeof ROUTES];
  fallback?: React.ReactNode;
  element: React.ReactNode | null;
  routes?: IRoute[];
  redirect?: string;
  private?: boolean;
  layout: keyof typeof LayoutConfig;
  roles: Array<string>;
};
