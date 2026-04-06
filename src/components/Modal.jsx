import { AnimatePresence, motion } from "framer-motion";
import AnimatedCard from "./AnimatedCard";

export default function Modal({ isOpen, title, children, footer }) {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-[rgba(10,6,20,0.92)] px-4 py-6 backdrop-blur-md sm:items-center sm:py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatedCard
          className="reveal-card-shell w-full max-w-md border-white/70 bg-white/95 p-3 text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
        >
          <div className="panel-sheen" />
          <div className="reveal-card-inner bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6f4f92]">Round Details</p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase text-[#24195f]">{title}</h2>
            <div className="mt-5 space-y-4 text-[#513b6d]">{children}</div>
            {footer ? <div className="mt-6 flex flex-wrap gap-3">{footer}</div> : null}
          </div>
        </AnimatedCard>
      </motion.div>
    </AnimatePresence>
  );
}
