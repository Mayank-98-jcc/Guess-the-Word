import { motion } from "framer-motion";

export default function AnimatedCard({
  as = "div",
  className = "",
  children,
  selected = false,
  interactive = false,
  whileHover,
  whileTap,
  ...props
}) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      whileHover={
        interactive
          ? whileHover ?? { y: -5, scale: selected ? 1.08 : 1.02, boxShadow: "0 24px 54px rgba(96, 38, 160, 0.22)" }
          : whileHover
      }
      whileTap={interactive ? whileTap ?? { scale: 0.98 } : whileTap}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={`premium-card ${selected ? "premium-card-selected" : ""} ${interactive ? "interactive-glow" : ""} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
