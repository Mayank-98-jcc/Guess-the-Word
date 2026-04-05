import { AnimatePresence, motion } from "framer-motion";
import AnimatedOverlay from "./AnimatedOverlay";
import Button from "./Button";

const sparkBits = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  angle: index * 30,
  delay: index * 0.03,
}));

export default function ImposterReveal({
  isOpen,
  player,
  result,
  showResult = false,
  isFinalRound = false,
  onContinue,
}) {
  if (!player) {
    return null;
  }

  const isImposter = result === "IMPOSTER_ELIMINATED";

  return (
    <AnimatedOverlay isOpen={isOpen} className="bg-[#05020d]/90" opacity={1} blur="10px">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-0 overflow-hidden">
        {sparkBits.map((spark) => (
          <motion.span
            key={spark.id}
            className={`absolute left-1/2 top-1/2 h-16 w-[2px] origin-bottom rounded-full ${
              isImposter ? "bg-gradient-to-t from-rose-500/70 to-transparent" : "bg-gradient-to-t from-amber-400/70 to-transparent"
            }`}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 0.8, 0], scaleY: [0, 1, 0.3] }}
            transition={{ duration: 0.8, delay: 0.55 + spark.delay, ease: "easeOut" }}
            style={{ transform: `translate(-50%, -100%) rotate(${spark.angle}deg)` }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-xl"
        >
          <motion.div
            className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] ${
              isImposter ? "bg-rose-500/35" : "bg-amber-300/25"
            }`}
            animate={{ scale: [0.9, 1.12, 1], opacity: [0.25, 0.48, 0.3] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ y: 40, opacity: 0.4, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: [0.92, 1.18, 1.3] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="reveal-card-shell relative z-10 p-3"
          >
            <div className="panel-sheen" />
            <div className="reveal-card-inner relative overflow-hidden px-8 py-10 text-center sm:px-10 sm:py-12">
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.18),transparent_45%)]"
                animate={{ opacity: [0.1, 0.22, 0.12] }}
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-white/25"
                initial={{ opacity: 0.55, scale: 1 }}
                animate={{ opacity: [0.55, 0, 0], scale: [1, 1.08, 1.12] }}
                transition={{ duration: 0.45, delay: 0.45, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.95, 0] }}
                transition={{ duration: 0.2, delay: 0.58, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white" />
              </motion.div>

              <p className="relative z-10 text-sm font-bold uppercase tracking-[0.45em] text-[#694f83]">Eliminated Player</p>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="relative z-10 mt-5 font-display text-5xl font-black uppercase text-[#24195f] sm:text-6xl"
              >
                {player.name}
              </motion.h3>
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.72 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.06, duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 mt-8 flex flex-col items-center"
                  >
                    <motion.p
                      animate={{
                        scale: [0.5, 1.2, 1],
                        opacity: [0, 1, 1],
                      }}
                      transition={{ duration: 0.72, delay: 0.12, ease: "easeOut" }}
                      className={`max-w-[12ch] text-center font-display text-5xl font-black uppercase leading-[0.9] sm:text-7xl ${
                        isImposter
                          ? "bg-gradient-to-b from-rose-300 via-rose-500 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(244,63,94,0.48)]"
                          : "bg-gradient-to-b from-amber-200 via-amber-500 to-orange-700 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(245,158,11,0.42)]"
                      }`}
                    >
                      {isImposter ? "Imposter 😈" : "Innocent"}
                    </motion.p>
                    <p className="mt-5 max-w-md text-center text-sm font-semibold text-[#5f4a73] sm:text-base">
                      {isImposter
                        ? "The mask breaks. The room finally sees the liar."
                        : "The group cut down one of their own. Suspicion keeps spreading."}
                    </p>
                    <div className="mt-7">
                      <Button type="button" onClick={onContinue} className="reveal-bottom-glow min-w-[18rem]">
                        {isFinalRound ? "Continue To Celebration" : "Back To The Table"}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="suspense"
                    initial={{ opacity: 0.4, scale: 0.96 }}
                    animate={{ opacity: [0.4, 1, 0.65], scale: [0.96, 1.03, 0.99], x: [-10, 10, -10, 10, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="relative z-10 mt-8"
                  >
                    <p className="font-display text-4xl font-black uppercase text-[#24195f]">Mask Breaking...</p>
                    <div className="mx-auto mt-5 w-full max-w-[14rem] space-y-3">
                      <div className="skeleton-bar h-3 w-full rounded-full" />
                      <div className="skeleton-bar h-3 w-4/5 rounded-full" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedOverlay>
  );
}
