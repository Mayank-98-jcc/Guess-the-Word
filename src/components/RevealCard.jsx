import { AnimatePresence, motion } from "framer-motion";
import { GAME_MODES } from "../features/game/gameLogic";

export default function RevealCard({ player, word, hint, hintLabel, mode, chaosVariant, isRevealed, isRevealing, onReveal }) {
  const isImposter = player?.role === "IMPOSTER";
  const displayedWord = player?.secretWord || word;
  const displayedHint = player?.secretHint || hint;
  const isChaosMode = mode === GAME_MODES.CHAOS;

  return (
    <motion.button
      type="button"
      onClick={onReveal}
      className="relative mx-auto block h-[24rem] w-full max-w-[28rem] [perspective:1200px] sm:h-[28rem]"
      whileTap={{ scale: isRevealed ? 1 : 0.98 }}
    >
      <motion.div
        animate={{ rotateY: isRevealed ? 180 : 0, scale: isRevealed ? 1.02 : 1 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <div className="card-face absolute inset-0 p-2">
          <motion.div
            className="reveal-card-shell h-full w-full p-3"
            animate={
              isRevealing
                ? {
                    x: [-6, 6, -4, 4, 0],
                    filter: ["blur(0px)", "blur(2px)", "blur(1px)", "blur(0px)"],
                  }
                : { x: 0, filter: "blur(0px)" }
            }
            transition={{ duration: 0.32, ease: "easeInOut" }}
          >
            <div className="panel-sheen" />
            <div className="reveal-card-inner flex h-full w-full flex-col items-center justify-center px-6 text-center sm:px-8">
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#7c6393]">Private Reveal</p>
              <h3 className="mt-5 max-w-full break-words text-center font-display text-3xl font-black uppercase leading-[0.95] text-[#2c216d] sm:text-4xl">
                {player?.name}
              </h3>
              <p className="reveal-pill mt-7 rounded-full bg-[#2d216d] px-7 py-3 font-display text-sm font-black uppercase tracking-[0.28em] text-white">
                Tap To Reveal
              </p>
              <p className="mt-6 max-w-xs text-sm font-medium text-[#715d85]">
                Everyone else look away before opening this card.
              </p>
            </div>
          </motion.div>
        </div>

        <div className={`card-face card-face-back absolute inset-0 p-2 ${isImposter ? "text-[#d82f7d]" : "text-[#2c216d]"}`}>
          <div className="reveal-card-shell h-full w-full p-3">
            <div className="panel-sheen" />
            <div className={`reveal-card-inner flex h-full w-full flex-col items-center justify-center px-6 text-center ${isChaosMode ? "chaos-shell" : ""} sm:px-8`}>
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.92 }}
                animate={isRevealed ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.35 }}
                className={`flex w-full flex-col items-center ${isChaosMode && isRevealed ? "chaos-glitch" : ""}`}
              >
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#7c6393]">Secret Role</p>
                <h3 className="mt-5 max-w-full break-words text-center font-display text-3xl font-black uppercase leading-[0.95] text-[#2c216d] sm:text-4xl">
                  {player?.name}
                </h3>
                <div className="mt-8 w-full max-w-[19rem] rounded-[1.6rem] bg-white px-5 py-5 shadow-[0_18px_35px_rgba(75,37,128,0.14)] sm:px-7">
                  {isImposter ? (
                    <div>
                      <p className="text-base font-black uppercase tracking-[0.18em] text-[#e05699]">You Are The</p>
                      <p className="mt-1 font-display text-4xl font-black uppercase text-[#d92f80] sm:text-5xl">
                        Imposter
                      </p>
                      <AnimatePresence>
                        {isRevealed && displayedHint ? (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ delay: 0.28, duration: 0.6 }}
                            className="mt-5 rounded-full bg-gradient-to-r from-orange-100 to-fuchsia-100 px-5 py-3 shadow-[0_0_20px_rgba(255,160,92,0.28)]"
                          >
                            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#a55d8d]">{hintLabel}</p>
                            <motion.p
                              animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.02, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                              className="mt-1 font-display text-2xl font-black text-[#d92f80]"
                            >
                              {displayedHint}
                            </motion.p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isRevealed ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.18, duration: 0.35 }}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#a48faf]">Secret Word</p>
                      <p className="mx-auto mt-2 max-w-full whitespace-nowrap text-center font-display text-[clamp(1.6rem,5.2vw,3.7rem)] font-black leading-none tracking-[-0.04em] text-[#2c216d]">
                        {displayedWord}
                      </p>
                    </motion.div>
                  )}
                </div>
                <motion.p
                  animate={
                    isImposter && isRevealed
                      ? { scale: [1, 1.03, 1], opacity: [0.85, 1, 0.9] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 1.6, repeat: isImposter && isRevealed ? Number.POSITIVE_INFINITY : 0 }}
                  className={`mt-7 max-w-xs text-sm font-medium ${
                    isImposter && isRevealed ? "text-[#c73b72] drop-shadow-[0_0_14px_rgba(217,47,128,0.28)]" : "text-[#715d85]"
                  }`}
                >
                  {isImposter
                    ? isChaosMode && chaosVariant === "TWIN"
                      ? "YOU ARE THE IMPOSTER 😈 Blend in with your nearby word."
                      : "YOU ARE THE IMPOSTER 😈 Read the room and survive."
                    : isChaosMode && chaosVariant === "TWIN"
                      ? "Your word may not match every clue. Stay sharp and catch the fake."
                      : "Keep calm, give smart clues, and catch the imposter."}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}
