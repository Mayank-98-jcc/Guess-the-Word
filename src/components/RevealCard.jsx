import { memo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useIsMobileViewport from "../hooks/useIsMobileViewport";
import { GAME_MODES } from "../features/game/gameLogic";

function getWordLayout(word = "") {
  const normalizedWord = word.trim();
  const wordParts = normalizedWord.split(/\s+/).filter(Boolean);
  const longestPartLength = wordParts.reduce((maxLength, part) => Math.max(maxLength, part.length), 0);

  if (wordParts.length > 1) {
    return {
      containerClassName: "px-4 py-5 sm:px-5",
      textClassName:
        "max-w-full whitespace-normal break-words text-[clamp(1.5rem,4vw,3rem)] leading-[0.92] tracking-[-0.03em]",
    };
  }

  if (longestPartLength >= 14) {
    return {
      containerClassName: "px-4 py-5 sm:px-5",
      textClassName:
        "max-w-full whitespace-nowrap text-[clamp(1.2rem,4vw,2.6rem)] leading-none tracking-[-0.05em]",
    };
  }

  if (longestPartLength >= 10) {
    return {
      containerClassName: "px-4 py-5 sm:px-6",
      textClassName:
        "max-w-full whitespace-nowrap text-[clamp(1.35rem,4.5vw,3rem)] leading-none tracking-[-0.05em]",
    };
  }

  return {
    containerClassName: "px-5 py-5 sm:px-7",
    textClassName:
      "max-w-full whitespace-nowrap text-[clamp(1.6rem,5.2vw,3.7rem)] leading-none tracking-[-0.04em]",
  };
}

function RevealCard({ player, word, hint, hintLabel, mode, chaosVariant, isRevealed, isRevealing, onReveal }) {
  const reduceMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();
  const isImposter = player?.role === "IMPOSTER";
  const displayedWord = player?.secretWord || word;
  const displayedHint = player?.secretHint || hint;
  const isChaosMode = mode === GAME_MODES.CHAOS;
  const { containerClassName, textClassName } = getWordLayout(displayedWord);
  const shouldSimplifyMotion = reduceMotion || isMobileViewport;

  return (
    <motion.button
      type="button"
      onClick={onReveal}
      className="relative mx-auto block h-[22rem] w-full max-w-[28rem] [perspective:1200px] sm:h-[28rem]"
      whileTap={{ scale: isRevealed ? 1 : 0.97 }}
    >
      <motion.div
        animate={{ rotateY: isRevealed ? 180 : 0, scale: isRevealed && !shouldSimplifyMotion ? 1.01 : 1 }}
        transition={{ duration: shouldSimplifyMotion ? 0.56 : 0.62, ease: "easeInOut" }}
        className="relative h-full w-full transform-gpu [transform-style:preserve-3d] will-change-transform"
      >
        <div className="card-face absolute inset-0 p-2">
          <motion.div
            className="reveal-card-shell h-full w-full p-3"
            animate={
              isRevealing && !shouldSimplifyMotion
                ? {
                    scale: [1, 0.992, 1],
                    x: [0, 3, 0],
                  }
                : { x: 0, scale: 1 }
            }
            transition={{ duration: 0.18, ease: "easeInOut" }}
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
                initial={false}
                animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ delay: isRevealed ? 0.16 : 0, duration: shouldSimplifyMotion ? 0.2 : 0.28, ease: "easeOut" }}
                className={`flex w-full flex-col items-center ${isChaosMode && isRevealed ? "chaos-glitch" : ""}`}
              >
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#7c6393]">Secret Role</p>
                <h3 className="mt-5 max-w-full break-words text-center font-display text-3xl font-black uppercase leading-[0.95] text-[#2c216d] sm:text-4xl">
                  {player?.name}
                </h3>
                <div className={`mt-8 w-full max-w-[19rem] rounded-[1.6rem] bg-white shadow-[0_18px_35px_rgba(75,37,128,0.14)] ${containerClassName}`}>
                  {isImposter ? (
                    <div>
                      <p className="text-base font-black uppercase tracking-[0.18em] text-[#e05699]">You Are The</p>
                      <p className="mt-1 font-display text-4xl font-black uppercase text-[#d92f80] sm:text-5xl">
                        Imposter
                      </p>
                      <AnimatePresence>
                        {isRevealed && displayedHint ? (
                          <motion.div
                            initial={false}
                            animate={{ opacity: 1, y: 0, scale: shouldSimplifyMotion ? 1 : [1, 1.02, 1] }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ delay: 0.22, duration: shouldSimplifyMotion ? 0.24 : 0.45 }}
                            className="mt-5 rounded-full bg-gradient-to-r from-orange-100 to-fuchsia-100 px-5 py-3 shadow-[0_0_20px_rgba(255,160,92,0.28)]"
                          >
                            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#a55d8d]">{hintLabel}</p>
                            <motion.p
                              animate={shouldSimplifyMotion ? { opacity: 1, scale: 1 } : { opacity: [0.9, 1, 0.9], scale: [1, 1.015, 1] }}
                              transition={{ duration: 1.8, repeat: shouldSimplifyMotion ? 0 : Number.POSITIVE_INFINITY, ease: "easeInOut" }}
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
                      initial={false}
                      animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                      transition={{ delay: 0.14, duration: shouldSimplifyMotion ? 0.2 : 0.26, ease: "easeOut" }}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#a48faf]">Secret Word</p>
                      <p className={`mx-auto mt-2 text-center font-display font-black text-[#2c216d] ${textClassName}`}>
                        {displayedWord}
                      </p>
                    </motion.div>
                  )}
                </div>
                <motion.p
                  animate={
                    isImposter && isRevealed && !shouldSimplifyMotion
                      ? { scale: [1, 1.03, 1], opacity: [0.85, 1, 0.9] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 1.6, repeat: isImposter && isRevealed && !shouldSimplifyMotion ? Number.POSITIVE_INFINITY : 0 }}
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

export default memo(RevealCard);
