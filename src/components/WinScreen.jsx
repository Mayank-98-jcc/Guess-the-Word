import { motion } from "framer-motion";
import AnimatedOverlay from "./AnimatedOverlay";
import Button from "./Button";
import Confetti from "./Confetti";
import Fireworks from "./Fireworks";

export default function WinScreen({
  isOpen,
  winner,
  winners = [],
  onRevealAnswer,
  onPlayAgain,
}) {
  const crewWins = winner === "CREW";

  return (
    <AnimatedOverlay isOpen={isOpen} className="bg-[linear-gradient(135deg,rgba(76,29,149,0.9),rgba(219,39,119,0.82),rgba(249,115,22,0.78))]" opacity={1} blur="4px">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_42%)]" />
        <Confetti />
        <Fireworks />
      </motion.div>

      <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-[2rem] px-2 py-4 text-white sm:px-6 sm:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.12),transparent_38%)]" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-center text-sm font-bold uppercase tracking-[0.42em] text-white/75 sm:text-base"
            >
              Final Verdict
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
              transition={{ duration: 0.75, delay: 0.22, ease: "easeOut" }}
              className="mx-auto mt-4 max-w-[10ch] text-center font-display text-6xl font-black uppercase leading-[0.86] tracking-[-0.04em] text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.28)] sm:text-8xl md:text-[7.5rem]"
            >
              {crewWins ? "Crewmates Win 🎉" : "Imposter Wins 😈"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="mx-auto mt-5 max-w-3xl text-center text-lg font-medium text-white/90 sm:text-[2rem]"
            >
              {crewWins
                ? "The bluff collapsed under pressure. The room celebrates the catch."
                : "The deception held long enough. The imposter owns the round."}
            </motion.p>

            <div className="mx-auto mt-10 grid max-w-2xl gap-4">
              {winners.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 + index * 0.06 }}
                >
                  <div className="winner-card relative overflow-hidden rounded-[2rem] border border-orange-200/60 bg-white/8 px-6 py-5 text-center shadow-[0_0_0_2px_rgba(255,181,104,0.28),0_0_40px_rgba(255,135,67,0.28)] backdrop-blur-xl">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,194,108,0.18),rgba(255,255,255,0.05)_42%,rgba(147,51,234,0.18))]" />
                    <motion.div
                      className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/18 blur-3xl"
                      animate={{ scale: [0.9, 1.18, 0.96], opacity: [0.3, 0.58, 0.34] }}
                      transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                    <div className="relative z-10">
                      <p className="text-sm font-bold uppercase tracking-[0.38em] text-white/75">
                        {crewWins ? "Winning Crewmate" : "Winning Imposter"}
                      </p>
                      <p className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">{player.name}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
              <Button type="button" onClick={onRevealAnswer} className="reveal-bottom-glow h-16 flex-1 text-lg">
                Reveal Answer
              </Button>
              <Button type="button" variant="ghost" className="reveal-bottom-glow h-16 flex-1 border border-white/30 text-lg bg-white/12" onClick={onPlayAgain}>
                Play Again
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedOverlay>
  );
}
