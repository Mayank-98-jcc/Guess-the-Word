import { Navigate, useLocation, useRoutes } from "react-router-dom";
import RevealPage from "../features/reveal/RevealPage";
import ResultPage from "../features/result/ResultPage";
import SetupPage from "../features/setup/SetupPage";

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
