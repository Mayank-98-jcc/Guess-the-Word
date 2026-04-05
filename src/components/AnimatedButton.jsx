import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const variants = {
  primary:
    "bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 text-white shadow-[0_18px_42px_rgba(133,42,182,0.34),0_0_24px_rgba(255,183,77,0.28)]",
  secondary:
    "bg-white/80 text-slate-900 shadow-[0_14px_32px_rgba(65,24,104,0.18)] backdrop-blur-lg",
  ghost:
    "bg-white/10 text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] backdrop-blur-lg border border-white/20",
};

export default function AnimatedButton({
  children,
  className = "",
  variant = "primary",
  icon,
  disabled,
  onClick,
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (event) => {
    if (!disabled) {
      const rect = event.currentTarget.getBoundingClientRect();
      const nextRipple = {
        id: Date.now() + Math.random(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      setRipples((current) => [...current, nextRipple]);
      window.setTimeout(() => {
        setRipples((current) => current.filter((ripple) => ripple.id !== nextRipple.id));
      }, 520);
    }

    onClick?.(event);
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05, filter: "brightness(1.08)" }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className={`interactive-glow relative inline-flex min-h-[3.25rem] overflow-hidden rounded-full px-4 py-3 text-center font-display text-[0.7rem] font-black uppercase tracking-[0.08em] sm:min-h-12 sm:px-5 sm:text-sm ${
        variants[variant]
      } ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_30%,transparent_68%,rgba(255,255,255,0.12))]" />
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ opacity: 0.35, scale: 0 }}
            animate={{ opacity: 0, scale: 4.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute h-24 w-24 rounded-full bg-white/45"
            style={{ left: ripple.x - 48, top: ripple.y - 48 }}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10 inline-flex w-full items-center justify-center gap-2 text-center leading-tight">
        {icon ? <span>{icon}</span> : null}
        <span>{children}</span>
      </span>
    </motion.button>
  );
}
