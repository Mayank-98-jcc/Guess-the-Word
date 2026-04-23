import { lazy } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";

export const routeModules = {
  setup: () => import("../features/setup/SetupPage"),
  reveal: () => import("../features/reveal/RevealPage"),
  result: () => import("../features/result/ResultPage"),
};

const SetupPage = lazy(routeModules.setup);
const RevealPage = lazy(routeModules.reveal);
const ResultPage = lazy(routeModules.result);

export default function AppRoutes() {
  const location = useLocation();

  return useRoutes([
    {
      path: "/",
      element: <SetupPage />,
    },
    {
      path: "/reveal",
      element: <RevealPage />,
    },
    {
      path: "/result",
      element: <ResultPage />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ], location);
}
