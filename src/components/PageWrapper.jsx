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

const mobileParticles = particles.slice(0, 2);

function PageWrapper({ children, className = "", chaos = false, staticPage = false }) {
  const reduceMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();
  const visibleParticles = reduceMotion ? [] : isMobileViewport ? mobileParticles : particles.slice(0, 4);

  return (
    <motion.main
      className={`app-shell ${staticPage ? "page-static" : ""} ${chaos ? "chaos-shell" : ""} ${className}`}
      initial={reduceMotion ? false : staticPage ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : staticPage ? { opacity: 0 } : { opacity: 0, y: -30 }}
      transition={{ duration: reduceMotion ? 0.16 : 0.24, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
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
            duration: Math.max(5.5, particle.duration - 1.6),
            delay: particle.delay,
            repeat: 1,
            ease: "easeInOut",
          }}
        />
      ))}
      {children}
    </motion.main>
  );
}

export default memo(PageWrapper);
