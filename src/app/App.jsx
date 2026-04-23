import { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import { measureAppBoot, observeLongTasks, reportRouteTransition } from "../utils/performance";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const stopObserving = observeLongTasks();
    measureAppBoot();

    return stopObserving;
  }, []);

  useEffect(() => {
    reportRouteTransition(location.pathname);
  }, [location.pathname]);

  return (
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-white">Loading game...</div>}>
      <AppRoutes />
    </Suspense>
  );
}
