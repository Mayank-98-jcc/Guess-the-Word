import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-white">Loading game...</div>}>
      <AnimatePresence mode="wait">
        <AppRoutes key={location.pathname} />
      </AnimatePresence>
    </Suspense>
  );
}
