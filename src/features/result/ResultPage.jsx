import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useGame } from "../../hooks/useGame";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function ResultPage() {
  const { state, meta, actions } = useGame();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(state.timerSeconds);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEliminating, setIsEliminating] = useState(false);
  const [showEliminationReveal, setShowEliminationReveal] = useState(false);

  useEffect(() => {
    if (state.phase === "SETUP") {
      navigate("/");
    }
  }, [navigate, state.phase]);

  useEffect(() => {
    if (!state.timerEnabled) {
      return undefined;
    }

    setTimeLeft(state.timerSeconds);

    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.timerEnabled, state.timerSeconds]);

  useEffect(() => {
    if (!state.eliminationResult) {
      setShowEliminationReveal(false);
      setIsEliminating(false);
      return undefined;
    }

    setIsEliminating(true);
    const revealTimer = window.setTimeout(() => {
      setShowEliminationReveal(true);
      setIsEliminating(false);
    }, 1400);

    return () => window.clearTimeout(revealTimer);
  }, [state.eliminationResult]);

  const imposterNames = useMemo(
    () => state.players.filter((player) => state.imposters.includes(player.id)).map((player) => player.name),
    [state.imposters, state.players],
  );
  const selectedPlayerData = state.players.find((player) => player.id === state.selectedPlayer) ?? null;
  const eliminatedPlayer = state.players.find((player) => player.id === state.eliminationTargetId) ?? null;
  const isDiscussionPhase = state.phase === "DISCUSS";
  const isEliminationPhase = state.phase === "ELIMINATION";
  const isFinalResultPhase = state.phase === "RESULT";
  const canConfirmElimination = Boolean(selectedPlayerData) && !isEliminating && !showEliminationReveal;

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

      <motion.button
        type="button"
        whileHover={{ rotate: 18, scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white/18 text-xl text-white shadow-[0_12px_30px_rgba(118,52,168,0.28)] backdrop-blur-md sm:right-8 sm:top-5 sm:h-14 sm:w-14 sm:text-2xl"
      >
        ⚙
      </motion.button>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <section className="mx-auto w-full max-w-4xl text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={isDiscussionPhase ? "discussion" : isEliminationPhase ? "elimination" : "final"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <p className="text-stroke-title text-2xl font-black uppercase sm:text-4xl md:text-5xl">
                {isDiscussionPhase
                  ? "Discuss And Find The Imposter"
                  : isEliminationPhase
                    ? "Choose Who To Eliminate"
                    : state.winner === "CREW"
                      ? "Crew Victory"
                      : "Imposter Victory"}
              </p>
              <h1 className="hero-title mt-4 font-display text-5xl font-black uppercase leading-[0.84] sm:text-6xl md:text-8xl">
                {isDiscussionPhase ? (
                  <>
                    Time To
                    <span className="block">Debate</span>
                  </>
                ) : isEliminationPhase ? (
                  <>
                    Cast Your
                    <span className="block">Vote</span>
                  </>
                ) : state.winner === "CREW" ? (
                  <>
                    Imposter
                    <span className="block">Caught</span>
                  </>
                ) : (
                  <>
                    Darkness
                    <span className="block">Wins</span>
                  </>
                )}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl px-2 text-sm font-semibold text-white/90 sm:mt-5 sm:text-base md:text-lg">
                {isDiscussionPhase
                  ? "Everyone has seen their card. Compare clues, catch the bluff, and make the imposter sweat."
                  : isEliminationPhase
                    ? "Tap a player, confirm the vote, and let the room hold its breath for the reveal."
                    : state.winner === "CREW"
                      ? "The imposter was exposed. The crew survives another round."
                      : "Only two players remain. The imposter has taken over the game."}
              </p>
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="mx-auto mt-8 grid w-full max-w-5xl gap-5 sm:gap-6 lg:mt-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            className="glass-panel screen-glow relative overflow-hidden p-5 sm:p-6"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="panel-sheen" />
            <div className={`rounded-[1.8rem] bg-gradient-to-br ${meta.selectedCategory.accent} p-6 text-white shadow-[0_18px_36px_rgba(120,52,188,0.18)]`}>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/75">Category</p>
              <h2 className="mt-3 font-display text-3xl font-black uppercase sm:text-4xl">{meta.selectedCategory.label}</h2>
              <p className="mt-4 max-w-md text-sm text-white/85">{meta.selectedCategory.description}</p>
            </div>

            <div className="frosted-inner mt-5 rounded-[1.8rem] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8b6ea0]">
                {isDiscussionPhase ? "Players" : isEliminationPhase ? "Vote Board" : "Final Board"}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <AnimatePresence>
                  {state.players.map((player, index) => (
                    <motion.button
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ delay: 0.22 + index * 0.04 }}
                    whileHover={player.isAlive === false || !isEliminationPhase || isEliminating || showEliminationReveal ? {} : { scale: 1.04, y: -4 }}
                    whileTap={player.isAlive === false || !isEliminationPhase || isEliminating || showEliminationReveal ? {} : { scale: 0.98 }}
                    disabled={player.isAlive === false || !isEliminationPhase || isEliminating || showEliminationReveal}
                    onClick={() => actions.selectPlayer(player.id)}
                    className={`rounded-[1.4rem] px-4 py-4 text-left shadow-[0_14px_30px_rgba(93,44,143,0.08)] transition ${
                      player.isAlive === false
                        ? "bg-white/35 opacity-55"
                        : state.selectedPlayer === player.id
                          ? "scale-[1.03] bg-white ring-2 ring-orange-200 shadow-[0_0_24px_rgba(255,187,92,0.35)]"
                          : "bg-white/74"
                    } ${isEliminating && state.eliminationTargetId === player.id ? "blur-0" : isEliminating ? "blur-[2px]" : ""}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9d84ae]">Player {String.fromCharCode(65 + index)}</p>
                    <p className={`mt-2 break-words font-display text-xl font-black uppercase sm:text-2xl ${player.isAlive === false ? "line-through" : ""} text-[#2c216d]`}>
                      {player.name}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b6ea0]">
                      {player.isAlive === false ? "Eliminated" : "Alive"}
                    </p>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="space-y-5"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <div className="glass-panel screen-glow relative overflow-hidden p-5 sm:p-6">
              <div className="panel-sheen" />
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8b6ea0]">
                {isDiscussionPhase ? "Round Timer" : isEliminationPhase ? "Selected Target" : "Game Result"}
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl font-black uppercase text-[#2c216d] sm:text-5xl">
                    {isDiscussionPhase
                      ? state.timerEnabled
                        ? formatTime(timeLeft)
                        : "Free Play"
                      : isEliminationPhase
                        ? selectedPlayerData?.name ?? "No Vote"
                        : state.winner === "CREW"
                          ? "Crew Wins"
                          : "Imposter Wins"}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-[#715d85]">
                    {isDiscussionPhase
                      ? state.timerEnabled
                        ? "The round ends when the countdown hits zero."
                        : "Talk as long as you want."
                      : isEliminationPhase
                        ? selectedPlayerData
                          ? `Confirm whether ${selectedPlayerData.name} should be eliminated.`
                          : "Select a living player to begin the elimination."
                        : state.winner === "CREW"
                          ? "The imposter was eliminated before the group fell apart."
                          : "The imposter survived until only two players remained."}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel screen-glow relative overflow-hidden p-5 sm:p-6">
              <div className="panel-sheen" />
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8b6ea0]">
                {isDiscussionPhase ? "How To Play" : isEliminationPhase ? "Elimination Rules" : "What Happened"}
              </p>
              <div className="mt-4 space-y-3 text-sm font-medium text-[#715d85]">
                {isDiscussionPhase ? (
                  <>
                    <p>Give clues without saying the exact word.</p>
                    <p>Watch for vague answers or suspicious confidence.</p>
                    <p>The imposter should listen, improvise, and guess the word before getting caught.</p>
                  </>
                ) : isEliminationPhase ? (
                  <>
                    <p>Tap one alive player to cast the group vote.</p>
                    <p>Confirm the elimination and wait for the dramatic reveal.</p>
                    <p>If the imposter survives until only two players remain, the imposter wins.</p>
                  </>
                ) : (
                  <>
                    <p>Secret word: {state.word}</p>
                    <p>Imposter: {imposterNames.join(", ")}</p>
                    <p>Alive players remaining: {state.alivePlayers.length}</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isDiscussionPhase ? (
                <>
                  <Button
                    type="button"
                    onClick={actions.startElimination}
                    className="reveal-bottom-glow flex-1"
                  >
                    Eliminate Player
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="reveal-bottom-glow flex-1 border border-white/30"
                    onClick={() => setShowAnswer(true)}
                  >
                    Reveal Answer
                  </Button>
                </>
              ) : isEliminationPhase ? (
                <>
                  <Button
                    type="button"
                    onClick={actions.eliminateSelectedPlayer}
                    disabled={!canConfirmElimination}
                    className="reveal-bottom-glow flex-1 disabled:opacity-50"
                  >
                    Confirm Elimination
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="reveal-bottom-glow flex-1 border border-white/30"
                    onClick={actions.clearSelectedPlayer}
                    disabled={isEliminating || showEliminationReveal}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                    className="reveal-bottom-glow flex-1"
                  >
                    Reveal Answer
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="reveal-bottom-glow flex-1 border border-white/30"
                    onClick={() => {
                      actions.resetGame();
                      navigate("/");
                    }}
                  >
                    New Round
                  </Button>
                </>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedPlayerData) && isEliminationPhase && !isEliminating && !showEliminationReveal}
        title="Confirm Elimination"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={actions.clearSelectedPlayer}>
              Cancel
            </Button>
            <Button type="button" onClick={actions.eliminateSelectedPlayer}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to eliminate {selectedPlayerData?.name}?</p>
      </Modal>

      <AnimatePresence>
        {(isEliminating || showEliminationReveal) && eliminatedPlayer ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#06030d] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_38%)]" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={
                isEliminating
                  ? { scale: [0.9, 1.05, 1], rotate: [0, -1.2, 1.2, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={
                isEliminating
                  ? { duration: 1.2, times: [0, 0.35, 1] }
                  : { duration: 0.35, ease: "easeOut" }
              }
              className="reveal-card-shell relative z-10 w-full max-w-xl p-3"
            >
              <div className="panel-sheen" />
              <div className="reveal-card-inner px-8 py-10 text-center sm:px-10 sm:py-12">
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#694f83]">Eliminated Player</p>
                <h3 className="mt-5 font-display text-5xl font-black uppercase text-[#24195f] sm:text-6xl">
                  {eliminatedPlayer.name}
                </h3>
                <AnimatePresence mode="wait">
                  {showEliminationReveal ? (
                    <motion.div
                      key="reveal"
                      initial={{ opacity: 0, scale: 0.72, y: 24 }}
                      animate={{ opacity: 1, scale: [0.92, 1.08, 1], y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                      className="mt-8 flex flex-col items-center"
                    >
                      <p
                        className={`max-w-[12ch] text-center font-display text-4xl font-black uppercase leading-[0.95] drop-shadow-[0_4px_18px_rgba(255,255,255,0.18)] sm:text-6xl ${
                          state.eliminationResult === "IMPOSTER_ELIMINATED" ? "text-[#d61f72]" : "text-[#d97706]"
                        }`}
                      >
                        {state.eliminationResult === "IMPOSTER_ELIMINATED"
                          ? "Imposter Eliminated"
                          : "Innocent Eliminated"}
                      </p>
                      <p className="mt-5 max-w-md text-center text-sm font-semibold text-[#5f4a73] sm:text-base">
                        {state.eliminationResult === "IMPOSTER_ELIMINATED"
                          ? "The room got it right. The imposter is out."
                          : "The vote was wrong. Tension rises for the next round."}
                      </p>
                      <div className="mt-7">
                        {state.phase === "RESULT" ? (
                          <Button
                            type="button"
                            onClick={() => {
                              setShowEliminationReveal(false);
                              setShowAnswer(true);
                            }}
                            className="reveal-bottom-glow w-full min-w-[18rem]"
                          >
                            Reveal Final Answer
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={actions.acknowledgeElimination}
                            className="reveal-bottom-glow w-full min-w-[18rem]"
                          >
                            Next Round
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="suspense"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.03, 1] }}
                      transition={{ duration: 0.85, repeat: Number.POSITIVE_INFINITY }}
                      className="mt-8"
                    >
                      <p className="font-display text-4xl font-black uppercase text-[#24195f]">Judgement...</p>
                      <p className="mt-4 text-sm font-semibold text-[#5f4a73]">The room goes silent before the reveal.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Modal
        isOpen={showAnswer}
        title="Round Answer"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAnswer(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowAnswer(false);
                actions.resetGame();
                navigate("/");
              }}
            >
              Play Again
            </Button>
          </>
        }
      >
        <div className={`rounded-[1.75rem] bg-gradient-to-br ${meta.selectedCategory.accent} p-5 text-white`}>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/75">Secret Word</p>
          <p className="mt-3 font-display text-5xl font-black">{state.word}</p>
        </div>
        <div className="frosted-inner rounded-[1.75rem] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8b6ea0]">Imposter</p>
          <p className="mt-3 font-display text-3xl font-black uppercase text-[#2c216d]">{imposterNames.join(", ")}</p>
        </div>
      </Modal>
    </motion.main>
  );
}
