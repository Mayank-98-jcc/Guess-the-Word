import { lazy } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";

const SetupPage = lazy(() => import("../features/setup/SetupPage"));
const RevealPage = lazy(() => import("../features/reveal/RevealPage"));
const ResultPage = lazy(() => import("../features/result/ResultPage"));

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
