import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ isOpen, title, children, footer }) {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="reveal-card-shell w-full max-w-md p-3 text-slate-900"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
        >
          <div className="panel-sheen" />
          <div className="reveal-card-inner p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c72a3]">Round Details</p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase text-[#2c216d]">{title}</h2>
            <div className="mt-5 space-y-4 text-[#715d85]">{children}</div>
            {footer ? <div className="mt-6 flex flex-wrap gap-3">{footer}</div> : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
