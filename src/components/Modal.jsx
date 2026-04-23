import { AnimatePresence, motion } from "framer-motion";
import AnimatedCard from "./AnimatedCard";
import useIsMobileViewport from "../hooks/useIsMobileViewport";

export default function Modal({
  isOpen,
  title,
  children,
  footer,
  fitMobileScreen = false,
  compactMobile = false,
}) {
  const isMobileViewport = useIsMobileViewport();
  const useFitMobileScreen = fitMobileScreen && isMobileViewport;
  const useCompactMobile = compactMobile && isMobileViewport;

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-[90] flex justify-center bg-[rgba(10,6,20,0.92)] px-3 backdrop-blur-md sm:px-4 ${
          useFitMobileScreen || useCompactMobile
            ? "items-center overflow-y-hidden py-3"
            : "items-start overflow-y-auto py-6 sm:items-center sm:py-4"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatedCard
          className={`reveal-card-shell w-full max-w-md border-white/70 bg-white/95 text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${
            useFitMobileScreen
              ? "max-h-[calc(100dvh-1.5rem)] p-2"
              : useCompactMobile
                ? "p-2"
                : "p-3"
          }`}
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
        >
          <div className="panel-sheen" />
          <div
            className={`reveal-card-inner bg-white ${
              useFitMobileScreen
                ? "flex max-h-[calc(100dvh-2rem)] flex-col p-4"
                : useCompactMobile
                  ? "p-4"
                  : "p-6"
            }`}
          >
            <div className={useFitMobileScreen ? "overflow-y-auto pr-1" : ""}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#6f4f92] sm:text-xs sm:tracking-[0.35em]">
                Round Details
              </p>
              <h2 className={`mt-2 font-display font-black uppercase leading-[0.92] text-[#24195f] ${useCompactMobile ? "text-[2rem]" : "text-[2.2rem] sm:text-3xl"}`}>
                {title}
              </h2>
              <div className={`text-[#513b6d] ${
                useFitMobileScreen
                  ? "mt-3 space-y-3 text-[0.98rem]"
                  : useCompactMobile
                    ? "mt-3 space-y-3 text-[0.98rem]"
                    : "mt-5 space-y-4"
              }`}>
                {children}
              </div>
            </div>
            {footer ? (
              <div className={`flex flex-wrap gap-3 ${useFitMobileScreen || useCompactMobile ? "mt-4" : "mt-6"}`}>
                {footer}
              </div>
            ) : null}
          </div>
        </AnimatedCard>
      </motion.div>
    </AnimatePresence>
  );
}
