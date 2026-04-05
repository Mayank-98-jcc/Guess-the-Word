import { motion } from "framer-motion";

export default function ConfusionOverlay({ active = false, className = "" }) {
  if (!active) {
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
        animate={{ opacity: [0.15, 0.3, 0.18], filter: ["hue-rotate(0deg)", "hue-rotate(14deg)", "hue-rotate(-10deg)"] }}
        transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 top-[12%] h-24 bg-white/10 blur-2xl"
        animate={{ x: ["-18%", "12%", "-8%"], opacity: [0.05, 0.13, 0.06] }}
        transition={{ duration: 4.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-[-10%] bottom-[18%] h-20 bg-fuchsia-200/10 blur-3xl"
        animate={{ x: ["10%", "-12%", "6%"], opacity: [0.05, 0.12, 0.08] }}
        transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
