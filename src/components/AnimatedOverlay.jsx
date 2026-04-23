import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedOverlay({
  isOpen,
  className = "",
  children,
  opacity = 0.85,
  blur = "12px",
  allowScroll = true,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={`hide-scrollbar fixed inset-0 z-[80] overflow-x-hidden ${allowScroll ? "overflow-y-auto" : "overflow-y-hidden"} ${className}`}
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
