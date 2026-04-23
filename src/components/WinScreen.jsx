import { motion } from "framer-motion";
import AppLogo from "./AppLogo";
import AnimatedOverlay from "./AnimatedOverlay";
import Button from "./Button";
import Confetti from "./Confetti";
import Fireworks from "./Fireworks";
import useIsMobileViewport from "../hooks/useIsMobileViewport";

export default function WinScreen({
  isOpen,
  winner,
  winners = [],
  onRevealAnswer,
  onPlayAgain,
}) {
  const crewWins = winner === "CREW";
  const isMobileViewport = useIsMobileViewport();

  return (
    <AnimatedOverlay
      isOpen={isOpen}
      className="bg-[linear-gradient(135deg,rgba(76,29,149,0.9),rgba(219,39,119,0.82),rgba(249,115,22,0.78))]"
      opacity={1}
      blur="4px"
      allowScroll={!isMobileViewport}
    >
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

      <div className="relative z-10 flex min-h-full items-center justify-center px-3 py-3 sm:px-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-[2rem] px-3 py-4 text-white sm:px-6 sm:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.12),transparent_38%)]" />
            <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
              <div>
                <AppLogo
                  animated
                  className="mx-auto w-[5.8rem] sm:w-[7rem]"
                  imageClassName="block w-full rounded-[1.4rem] shadow-[0_20px_42px_rgba(18,11,49,0.28)]"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="mt-4 text-center text-[0.68rem] font-bold uppercase tracking-[0.3em] text-white/75 sm:text-base"
                >
                  Final Verdict
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: [0.6, 1.06, 1] }}
                  transition={{ duration: 0.75, delay: 0.22, ease: "easeOut" }}
                  className="mx-auto mt-2 max-w-[8ch] text-center font-display text-[3rem] font-black uppercase leading-[0.86] tracking-[-0.05em] text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.28)] sm:mt-4 sm:max-w-[10ch] sm:text-8xl md:text-[7.5rem]"
                >
                  {crewWins ? "Crewmates Win 🎉" : "Imposter Wins 😈"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 }}
                  className="mx-auto mt-2 max-w-[18rem] text-center text-[0.92rem] font-medium leading-snug text-white/90 sm:mt-5 sm:max-w-3xl sm:text-[2rem]"
                >
                  {crewWins
                    ? "The bluff collapsed under pressure. The room celebrates the catch."
                    : "The deception held long enough. The imposter owns the round."}
                </motion.p>
              </div>

              <div className="mx-auto grid w-full max-w-xl gap-3">
                {winners.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 + index * 0.06 }}
                  >
                    <div className="winner-card relative overflow-hidden rounded-[1.4rem] border border-orange-200/60 bg-white/8 px-4 py-3 text-center shadow-[0_0_0_2px_rgba(255,181,104,0.28),0_0_40px_rgba(255,135,67,0.28)] backdrop-blur-xl sm:rounded-[2rem] sm:px-6 sm:py-5">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,194,108,0.18),rgba(255,255,255,0.05)_42%,rgba(147,51,234,0.18))]" />
                      <motion.div
                        className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/18 blur-3xl sm:h-40 sm:w-40"
                        animate={{ scale: [0.9, 1.12, 0.96], opacity: [0.3, 0.58, 0.34] }}
                        transition={{ duration: 1, repeat: 1, ease: "easeInOut" }}
                      />
                      <div className="relative z-10">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/75 sm:text-sm sm:tracking-[0.38em]">
                          {crewWins ? "Winning Crewmate" : "Winning Imposter"}
                        </p>
                        <p className="mt-1.5 font-display text-[2.2rem] font-black uppercase leading-none text-white sm:mt-3 sm:text-5xl">{player.name}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mx-auto w-full max-w-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button type="button" onClick={onRevealAnswer} className="reveal-bottom-glow h-12 flex-1 text-sm sm:h-16 sm:text-lg">
                    Reveal Answer
                  </Button>
                  <Button type="button" variant="ghost" className="reveal-bottom-glow h-12 flex-1 border border-white/30 bg-white/12 text-sm sm:h-16 sm:text-lg" onClick={onPlayAgain}>
                    Play Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedOverlay>
  );
}
