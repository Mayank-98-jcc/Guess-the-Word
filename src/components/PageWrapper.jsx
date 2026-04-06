import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import useIsMobileViewport from "../hooks/useIsMobileViewport";

const particles = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  size: 10 + (index % 4) * 6,
  left: `${6 + index * 7}%`,
  top: `${8 + ((index * 13) % 70)}%`,
  duration: 8 + (index % 5) * 1.8,
  delay: index * 0.18,
}));

function PageWrapper({ children, className = "", chaos = false }) {
  const reduceMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();
  const visibleParticles = reduceMotion || isMobileViewport ? [] : particles;

  return (
    <motion.main
      className={`app-shell ${chaos ? "chaos-shell" : ""} ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -30 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.38, ease: "easeInOut" }}
    >
      <div className="sparkle-field" />
      <div className="page-gradient-pulse" />
      {visibleParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`floating-particle ${particle.id > 5 ? "hidden sm:block" : ""}`}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -18, 12, 0],
                  x: [0, 10, -8, 0],
                  opacity: [0.12, 0.28, 0.14, 0.12],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
      {children}
    </motion.main>
  );
}

export default memo(PageWrapper);
