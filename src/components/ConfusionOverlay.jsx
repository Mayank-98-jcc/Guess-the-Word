import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import useIsMobileViewport from "../hooks/useIsMobileViewport";

function ConfusionOverlay({ active = false, className = "" }) {
  const reduceMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();

  if (!active || reduceMotion || isMobileViewport) {
    return null;
  }

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,222,141,0.12),transparent_28%,rgba(255,132,214,0.14)_58%,transparent_76%)] mix-blend-screen"
        animate={{ opacity: [0.12, 0.24, 0.16], x: ["-2%", "2%", "-1%"], scale: [1, 1.015, 1] }}
        transition={{ duration: 2.2, repeat: 1, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 top-[12%] h-24 bg-white/10 blur-2xl"
        animate={{ x: ["-18%", "12%", "-8%"], opacity: [0.05, 0.13, 0.06] }}
        transition={{ duration: 2.4, repeat: 1, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-[-10%] bottom-[18%] h-20 bg-fuchsia-200/10 blur-3xl"
        animate={{ x: ["10%", "-8%", "4%"], opacity: [0.05, 0.1, 0.07] }}
        transition={{ duration: 2.6, repeat: 1, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export default memo(ConfusionOverlay);
