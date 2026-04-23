import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

export default function DoubleWordIntro({ isOpen, onContinue }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[88] flex items-center justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_38%),linear-gradient(135deg,rgba(76,29,149,0.96),rgba(219,39,119,0.88),rgba(249,115,22,0.84))] px-4 py-8 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 bg-white/10"
            animate={{ opacity: [0.06, 0.22, 0.08] }}
            transition={{ duration: 0.36, repeat: 1, ease: "easeOut" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [0.8, 1.2, 1] }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl rounded-[2.4rem] border border-white/35 bg-white/12 p-4 text-center text-white shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_30px_90px_rgba(54,18,106,0.45)] backdrop-blur-2xl sm:p-6"
          >
            <div className="rounded-[2rem] border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] px-6 py-10 sm:px-10 sm:py-12">
              <motion.p
                className="text-sm font-black uppercase tracking-[0.48em] text-orange-100/90 sm:text-base"
                animate={{ opacity: [0.78, 1, 0.84], y: [0, -1, 0] }}
                transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                Twist Activated
              </motion.p>
              <motion.h2
                className="mt-5 font-display text-5xl font-black uppercase leading-[0.86] sm:text-7xl"
                animate={{ opacity: [0.92, 1, 0.94], scale: [1, 1.01, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                Double
                <span className="block">Word Mode</span>
              </motion.h2>
              <p className="mx-auto mt-5 max-w-xl text-base font-semibold text-white/88 sm:text-xl">
                Not everyone has the same word. Trust the room at your own risk.
              </p>
              <Button type="button" onClick={onContinue} className="reveal-bottom-glow mx-auto mt-8 min-w-[14rem] text-base">
                Start The Twist
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
