import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedOverlay({
  isOpen,
  className = "",
  children,
  opacity = 0.85,
  blur = "12px",
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={`fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ backdropFilter: `blur(${blur})` }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
