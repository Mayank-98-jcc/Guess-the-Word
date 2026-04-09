import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ConfusionOverlay from "../../components/ConfusionOverlay";
import DoubleWordIntro from "../../components/DoubleWordIntro";
import PageWrapper from "../../components/PageWrapper";
import WordRevealCard from "../../components/WordRevealCard";
import useIsMobileViewport from "../../hooks/useIsMobileViewport";
import { useGame } from "../../hooks/useGame";
import { GAME_MODES } from "../game/gameLogic";

export default function RevealPage() {
  const { state, meta, actions } = useGame();
  const navigate = useNavigate();
  const isMobileViewport = useIsMobileViewport();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showPassScreen, setShowPassScreen] = useState(true);
  const [showDoubleWordIntro, setShowDoubleWordIntro] = useState(state.mode === GAME_MODES.DOUBLE_WORD);

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
    setIsRevealing(false);
    setShowPassScreen(true);
    setShowDoubleWordIntro(state.mode === GAME_MODES.DOUBLE_WORD && state.currentPlayerIndex === 0);
  }, [state.currentPlayerIndex, state.mode]);

  const handleReveal = () => {
    if (isRevealed || isRevealing) {
      return;
    }

    setIsRevealing(true);
    window.setTimeout(() => {
      setIsRevealed(true);
      setIsRevealing(false);
    }, 300);

    if ("vibrate" in navigator) {
      navigator.vibrate([80, 40, 80]);
    }
  };

  const handleContinue = () => {
    const isLastPlayer = state.currentPlayerIndex === state.players.length - 1;

    if (isLastPlayer) {
      flushSync(() => {
        actions.beginDiscussion();
      });
      navigate("/result");
      return;
    }

    actions.nextPlayer();
  };

  const player = state.currentPlayer;
  const isChaosMode = state.mode === GAME_MODES.CHAOS;
  const isDoubleWordMode = state.mode === GAME_MODES.DOUBLE_WORD;

  if (!player) {
    return null;
  }

  return (
    <PageWrapper className="reveal-shell" chaos={isChaosMode || isDoubleWordMode}>
      <div className="reveal-stars" />
      <ConfusionOverlay active={isDoubleWordMode && !showDoubleWordIntro} />
      {!isMobileViewport ? (
        <>
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
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col items-center px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0)+1rem)] sm:px-6 sm:py-8">
        <div className="text-center text-white">
          <p className="text-stroke-title text-[0.85rem] font-black uppercase tracking-[0.22em] sm:text-4xl md:text-5xl">
            {isDoubleWordMode
              ? "Hidden Split"
              : isChaosMode
              ? state.chaosVariant === "DOUBLE"
                ? "Chaos: Double Imposters"
                : "Chaos: Twin Words"
              : player.role === "IMPOSTER"
                ? "One Imposter"
                : "One Secret Word"}
          </p>
          <h1 className="hero-title mt-2 font-display text-[2.15rem] font-black uppercase leading-[0.84] sm:mt-4 sm:text-6xl md:text-7xl">
            {isDoubleWordMode ? (
              <>
                Trust
                <span className={`block ${isRevealed ? "chaos-glitch" : ""}`}>Nobody</span>
              </>
            ) : isChaosMode ? (
              <>
                Total
                <span className={`block ${isRevealed ? "chaos-glitch" : ""}`}>Chaos</span>
              </>
            ) : (
              <>
                Imposter
                <span className="block">Who?</span>
              </>
            )}
          </h1>
          <p className="mx-auto mt-2 max-w-lg px-2 text-[0.88rem] font-semibold text-white/85 sm:mt-4 sm:text-base">
            {isDoubleWordMode ? "Something about the clues may feel slightly off tonight." : meta.modeSummary}
          </p>
        </div>

        <div className="mt-3 flex w-full flex-1 flex-col items-center justify-start sm:mt-3 sm:justify-center">
          <AnimatePresence mode="wait">
            {showDoubleWordIntro ? (
              <motion.div key="double-word-intro" className="w-full">
                <DoubleWordIntro isOpen={showDoubleWordIntro} onContinue={() => setShowDoubleWordIntro(false)} />
              </motion.div>
            ) : showPassScreen ? (
              <motion.section
                key={`pass-${player.id}`}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="w-full text-center"
              >
                <p className="mb-4 px-2 text-[0.72rem] font-bold uppercase tracking-[0.32em] text-white/80 sm:text-sm sm:tracking-[0.4em]">
                  Player {state.currentPlayerIndex + 1} of {state.players.length}
                </p>
                <div className="reveal-card-shell mx-auto w-full max-w-[28rem] p-2 sm:p-3">
                  <div className="panel-sheen" />
                  <div className="reveal-card-inner flex min-h-[18.5rem] flex-col items-center justify-center px-5 text-center sm:min-h-[24rem] sm:px-8">
                    <div className="reveal-nebula" />
                    <div className="reveal-starscape" />
                    <div className="pass-card-layout w-full">
                      <p className="reveal-title text-sm font-bold uppercase tracking-[0.45em]">Pass The Phone</p>
                      <motion.h2
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.28, ease: "easeOut" }}
                        className="reveal-title mt-2 break-words font-display text-6xl font-black uppercase sm:mt-3 sm:text-7xl"
                      >
                        {player.name.slice(0, 1)}
                      </motion.h2>
                      <p className="pass-card-copy font-medium">
                        Everyone else look away. Only {player.name.toLowerCase()} should open the secret card.
                      </p>
                      <Button
                        type="button"
                        onClick={() => setShowPassScreen(false)}
                        className="pass-card-button reveal-bottom-glow mt-2 w-full max-w-[19rem] self-center border border-white/35 sm:mt-3"
                      >
                        I&apos;m Ready
                      </Button>
                    </div>
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
                <p className="mb-4 px-2 text-[0.72rem] font-bold uppercase tracking-[0.32em] text-white/80 sm:text-sm sm:tracking-[0.4em]">
                  Player {state.currentPlayerIndex + 1} of {state.players.length}
                </p>
                <WordRevealCard
                  player={player}
                  word={state.word}
                  hint={state.wordHint}
                  hintLabel={meta.modeHintLabel}
                  mode={state.mode}
                  chaosVariant={state.chaosVariant}
                  isRevealed={isRevealed}
                  isRevealing={isRevealing}
                  onReveal={handleReveal}
                />
                <AnimatePresence>
                  {isRevealed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mx-auto mt-4 w-full max-w-[28rem] sm:mt-6"
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
    </PageWrapper>
  );
}
