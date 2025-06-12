import type { IRoute } from "@/core/routes/types/route-types";
import { ListSurveys } from "../screens/list-surveys";
import { ROUTES } from "@/core/routes/route-constants";
import { CreateSurveys } from "../screens/create-surveys";

export const surveyRoutes: IRoute[] = [
  {
    name: "List Surveys",
    element: <ListSurveys />,
    layout: "DefaultLayout",
    path: ROUTES.SURVEY_LIST,
    roles: [],
    private: true,
    routes: [],
  },
  {
    name: "Create Survey",
    element: <CreateSurveys />,
    layout: "DefaultLayout",
    path: ROUTES.SURVEY_CREATE,
    roles: [],
    private: true,
  },
];
