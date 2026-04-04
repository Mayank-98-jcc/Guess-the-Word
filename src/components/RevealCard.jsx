import { AnimatePresence, motion } from "framer-motion";

export default function RevealCard({ player, word, hint, isRevealed, onReveal }) {
  const isImposter = player?.role === "IMPOSTER";

  return (
    <motion.button
      type="button"
      onClick={onReveal}
      className="relative mx-auto block h-[24rem] w-full max-w-[25rem] [perspective:1200px] sm:h-[26rem]"
      whileTap={{ scale: isRevealed ? 1 : 0.98 }}
    >
      <motion.div
        animate={{ rotateY: isRevealed ? 180 : 0, scale: isRevealed ? 1.02 : 1 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <div className="card-face absolute inset-0 p-2">
          <div className="reveal-card-shell h-full w-full p-3">
            <div className="panel-sheen" />
            <div className="reveal-card-inner flex h-full flex-col items-center justify-center px-8 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#7c6393]">Private Reveal</p>
              <h3 className="mt-5 font-display text-4xl font-black uppercase text-[#2c216d] sm:text-5xl">{player?.name}</h3>
              <p className="reveal-pill mt-7 rounded-full bg-[#2d216d] px-7 py-3 font-display text-sm font-black uppercase tracking-[0.28em] text-white">
                Tap To Reveal
              </p>
              <p className="mt-6 max-w-xs text-sm font-medium text-[#715d85]">
                Everyone else look away before opening this card.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`card-face card-face-back absolute inset-0 p-2 ${
            isImposter ? "text-[#d82f7d]" : "text-[#2c216d]"
          }`}
        >
          <div className="reveal-card-shell h-full w-full p-3">
            <div className="panel-sheen" />
            <div className="reveal-card-inner flex h-full flex-col items-center justify-center px-8 text-center">
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.92 }}
                animate={isRevealed ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="flex flex-col items-center"
              >
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#7c6393]">Secret Role</p>
                <h3 className="mt-5 font-display text-4xl font-black uppercase text-[#2c216d] sm:text-5xl">{player?.name}</h3>
                <div className="mt-8 rounded-[1.6rem] bg-white px-8 py-5 shadow-[0_18px_35px_rgba(75,37,128,0.14)]">
                  {isImposter ? (
                    <div>
                      <p className="text-base font-black uppercase tracking-[0.18em] text-[#e05699]">You Are The</p>
                      <p className="mt-1 font-display text-4xl font-black uppercase text-[#d92f80] sm:text-5xl">
                        Imposter
                      </p>
                      <AnimatePresence>
                        {isRevealed && hint ? (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ delay: 0.28, duration: 0.6 }}
                            className="mt-5 rounded-full bg-gradient-to-r from-orange-100 to-fuchsia-100 px-5 py-3 shadow-[0_0_20px_rgba(255,160,92,0.28)]"
                          >
                            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#a55d8d]">Hint</p>
                            <motion.p
                              animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.02, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                              className="mt-1 font-display text-2xl font-black text-[#d92f80]"
                            >
                              {hint}
                            </motion.p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#a48faf]">Secret Word</p>
                      <p className="mt-2 font-display text-4xl font-black text-[#2c216d] sm:text-5xl">{word}</p>
                    </div>
                  )}
                </div>
                <p className="mt-7 max-w-xs text-sm font-medium text-[#715d85]">
                  {isImposter
                    ? "Listen carefully, blend in, and figure out the hidden word."
                    : "Keep calm, give smart clues, and catch the imposter."}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}
