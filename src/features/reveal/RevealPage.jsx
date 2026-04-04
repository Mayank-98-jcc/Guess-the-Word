import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import RevealCard from "../../components/RevealCard";
import { useGame } from "../../hooks/useGame";

export default function RevealPage() {
  const { state, actions } = useGame();
  const navigate = useNavigate();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPassScreen, setShowPassScreen] = useState(true);

  useEffect(() => {
    if (!state.players.length) {
      navigate("/");
    }
  }, [navigate, state.players.length]);

  useEffect(() => {
    if (state.phase === "SETUP" && !state.word) {
      navigate("/");
    }
  }, [navigate, state.phase, state.word]);

  useEffect(() => {
    if (state.phase === "DISCUSS") {
      navigate("/result");
    }
  }, [navigate, state.phase]);

  useEffect(() => {
    setIsRevealed(false);
    setShowPassScreen(true);
  }, [state.currentPlayerIndex]);

  const handleReveal = () => {
    if (isRevealed) {
      return;
    }

    setIsRevealed(true);

    if ("vibrate" in navigator) {
      navigator.vibrate([80, 40, 80]);
    }
  };

  const handleContinue = () => {
    const isLastPlayer = state.currentPlayerIndex === state.players.length - 1;

    if (isLastPlayer) {
      actions.beginDiscussion();
      return;
    }

    actions.nextPlayer();
  };

  const player = state.currentPlayer;

  if (!player) {
    return null;
  }

  return (
    <motion.main
      className="app-shell reveal-shell"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="reveal-stars" />
      <motion.div
        className="reveal-ribbon left-[-8%] top-[42%] h-28 w-[72%] rotate-[18deg]"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="reveal-ribbon right-[-8%] top-[30%] h-24 w-[58%] rotate-[-24deg]"
        animate={{ x: [0, -18, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="reveal-ribbon right-[-4%] bottom-[18%] h-24 w-[64%] rotate-[-18deg]"
        animate={{ x: [0, 16, 0] }}
        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-4 py-8 sm:px-6">
        <div className="text-center text-white">
          <p className="text-stroke-title text-4xl font-black uppercase sm:text-5xl">
            {player.role === "IMPOSTER" ? "One Imposter" : "One Secret Word"}
          </p>
          <h1 className="hero-title mt-5 font-display text-6xl font-black uppercase leading-[0.84] sm:text-7xl">
            Imposter
            <span className="block">Who?</span>
          </h1>
        </div>

        <div className="mt-4 flex flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showPassScreen ? (
              <motion.section
                key={`pass-${player.id}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full max-w-[26rem] text-center"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.4em] text-white/80">
                  Player {state.currentPlayerIndex + 1} of {state.players.length}
                </p>
                <div className="reveal-card-shell mx-auto p-3">
                  <div className="panel-sheen" />
                  <div className="reveal-card-inner flex min-h-[24rem] flex-col items-center justify-center px-8 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#7c6393]">Pass The Phone</p>
                    <h2 className="mt-5 font-display text-4xl font-black uppercase text-[#2c216d] sm:text-5xl">
                      {player.name}
                    </h2>
                    <p className="mt-5 max-w-xs text-sm font-medium text-[#715d85]">
                      Everyone else look away. Only {player.name} should open the secret card.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setShowPassScreen(false)}
                      className="reveal-bottom-glow mt-8 w-full max-w-[19rem]"
                    >
                      I&apos;m Ready
                    </Button>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key={`reveal-${player.id}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="w-full text-center"
              >
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.4em] text-white/80">
                  Player {state.currentPlayerIndex + 1} of {state.players.length}
                </p>
                <RevealCard
                  player={player}
                  word={state.word}
                  hint={state.wordHint}
                  isRevealed={isRevealed}
                  onReveal={handleReveal}
                />
                <AnimatePresence>
                  {isRevealed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mx-auto mt-6 max-w-[25rem]"
                    >
                      <Button type="button" onClick={handleContinue} className="reveal-bottom-glow w-full">
                        {state.currentPlayerIndex === state.players.length - 1 ? "Start Discussion" : "Pass To Next Player"}
                      </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  );
}
