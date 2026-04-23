import { AnimatePresence, motion } from "framer-motion";
import { lazy, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../components/AppLogo";
import Button from "../../components/Button";
import LeaveGameDialog from "../../components/LeaveGameDialog";
import PageWrapper from "../../components/PageWrapper";
import { useGame } from "../../hooks/useGame";
import { GAME_MODES } from "../game/gameLogic";

const AnimatedCard = lazy(() => import("../../components/AnimatedCard"));
const ConfusionOverlay = lazy(() => import("../../components/ConfusionOverlay"));
const ImposterReveal = lazy(() => import("../../components/ImposterReveal"));
const Modal = lazy(() => import("../../components/Modal"));
const PostRevealScreen = lazy(() => import("../../components/PostRevealScreen"));
const WinScreen = lazy(() => import("../../components/WinScreen"));

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
  const [showFlash, setShowFlash] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const hasRoundData = state.players.length > 0 && Boolean(state.word) && Boolean(meta.selectedCategory);

  useEffect(() => {
    if (!hasRoundData || state.phase === "SETUP") {
      navigate("/");
      return;
    }

    if (state.phase === "REVEAL") {
      navigate("/reveal");
    }
  }, [hasRoundData, navigate, state.phase]);

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
      setShowFlash(true);
      window.setTimeout(() => setShowFlash(false), 180);
      setShowEliminationReveal(true);
      setIsEliminating(false);
    }, 1400);

    return () => window.clearTimeout(revealTimer);
  }, [state.eliminationResult]);

  useEffect(() => {
    if (state.phase !== "RESULT") {
      setShowWinScreen(false);
    }
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "RESULT" && !state.eliminationResult) {
      setShowWinScreen(true);
    }
  }, [state.eliminationResult, state.phase]);

  const imposterNames = useMemo(
    () => state.players.filter((player) => state.imposters.includes(player.id)).map((player) => player.name),
    [state.imposters, state.players],
  );
  const selectedPlayerData = state.players.find((player) => player.id === state.selectedPlayer) ?? null;
  const eliminatedPlayer = state.players.find((player) => player.id === state.eliminationTargetId) ?? null;
  const discussionStarter = state.players.find((player) => player.id === state.discussionStarterId) ?? null;
  const isDiscussionPhase = state.phase === "DISCUSS";
  const isEliminationPhase = state.phase === "ELIMINATION";
  const canConfirmElimination = Boolean(selectedPlayerData) && !isEliminating && !showEliminationReveal;
  const isChaosMode = state.mode === GAME_MODES.CHAOS;
  const isDoubleWordMode = state.mode === GAME_MODES.DOUBLE_WORD;
  const winningPlayers = useMemo(
    () =>
      state.players.filter((player) =>
        state.winner === "CREW" ? player.role !== "IMPOSTER" : state.imposters.includes(player.id),
      ),
    [state.imposters, state.players, state.winner],
  );

  if (!hasRoundData) {
    return (
      <PageWrapper className="reveal-shell" chaos={isChaosMode || isDoubleWordMode}>
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-8 sm:px-6">
          <div className="glass-panel screen-glow w-full max-w-xl p-6 text-center text-white sm:p-8">
            <AppLogo
              animated
              className="mx-auto w-[6.5rem] sm:w-[7.5rem]"
              imageClassName="block w-full rounded-[1.4rem] border border-white/35 shadow-[0_20px_44px_rgba(24,12,62,0.24)]"
            />
            <p className="text-stroke-title text-xl font-black uppercase sm:text-3xl">
              No Active Round
            </p>
            <h1 className="hero-title mt-4 font-display text-4xl font-black uppercase leading-[0.9] sm:text-6xl">
              Returning
              <span className="block">Home</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm font-semibold text-white/85 sm:text-base">
              This page needs live game data, so a fresh deploy visit will send you back to the setup screen.
            </p>
            <Button type="button" onClick={() => navigate("/")} className="reveal-bottom-glow mt-6">
              Go To Setup
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="reveal-shell" chaos={isChaosMode || isDoubleWordMode}>
      <div className="reveal-stars" />
      <ConfusionOverlay active={isDoubleWordMode} />
      <button
        type="button"
        aria-label="Exit current game"
        onClick={() => setShowLeaveDialog(true)}
        className="absolute right-[calc(env(safe-area-inset-right,0)+1rem)] top-[calc(env(safe-area-inset-top,0)+1rem)] z-30 grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-white/18 font-display text-xl font-black text-white shadow-[0_12px_30px_rgba(118,52,168,0.28)] backdrop-blur-md transition hover:bg-white/25 sm:right-8 sm:top-5 sm:h-12 sm:w-12"
      >
        X
      </button>
      <LeaveGameDialog
        isOpen={showLeaveDialog}
        onStay={() => setShowLeaveDialog(false)}
        onLeave={() => {
          setShowLeaveDialog(false);
          setShowAnswer(false);
          setShowWinScreen(false);
          setShowEliminationReveal(false);
          actions.resetGame();
          navigate("/");
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-4 py-5 pb-[calc(env(safe-area-inset-bottom,0)+2rem)] sm:px-6 sm:py-7 sm:pb-7">
        <section className="mx-auto w-full max-w-4xl text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={isDiscussionPhase ? "discussion" : isEliminationPhase ? "elimination" : "final"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <AppLogo
                animated
                className="mx-auto mb-4 w-[6.5rem] sm:w-[7.5rem] md:w-[8.5rem]"
                imageClassName="block w-full rounded-[1.45rem] border border-white/35 shadow-[0_18px_44px_rgba(24,12,62,0.28)]"
              />
              <p className="text-stroke-title text-lg font-black uppercase sm:text-4xl md:text-5xl">
                {isDiscussionPhase
                  ? "Discuss And Find The Imposter"
                  : isEliminationPhase
                    ? "Choose Who To Eliminate"
                    : state.winner === "CREW"
                      ? "Crew Victory"
                      : "Imposter Victory"}
              </p>
              <h1 className="hero-title mt-4 font-display text-[2.9rem] font-black uppercase leading-[0.84] sm:text-6xl md:text-8xl">
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
                  ? isDoubleWordMode
                    ? "The room sounds wrong on purpose. Trust patterns, not perfect agreement."
                    : isChaosMode
                    ? "The table is unstable. Compare details carefully because not every player saw the same thing."
                    : "Everyone has seen their card. Compare clues, catch the bluff, and make the imposter sweat."
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
                    <AnimatedCard
                      as={isEliminationPhase ? "button" : "div"}
                      key={player.id}
                      type={isEliminationPhase ? "button" : undefined}
                      interactive={player.isAlive !== false && isEliminationPhase && !isEliminating && !showEliminationReveal}
                      selected={state.selectedPlayer === player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: player.isAlive === false ? 0.5 : 1,
                        y: 0,
                        scale: isEliminating && state.eliminationTargetId === player.id ? 1.06 : state.selectedPlayer === player.id ? 1.08 : 1,
                      }}
                      exit={{ opacity: 0, y: 18 }}
                      transition={{
                        delay: 0.22 + index * 0.04,
                        duration: 0.24,
                        ease: "easeInOut",
                      }}
                      disabled={player.isAlive === false || !isEliminationPhase || isEliminating || showEliminationReveal}
                      onClick={() => actions.selectPlayer(player.id)}
                      className={`min-h-24 rounded-[1.4rem] border px-4 py-4 text-left shadow-[0_14px_30px_rgba(93,44,143,0.08)] transition ${
                        player.isAlive === false
                          ? "border-white/20 bg-white/35 opacity-55"
                          : state.selectedPlayer === player.id
                            ? "border-orange-200/90 bg-white ring-2 ring-orange-200/80 shadow-[0_0_28px_rgba(255,187,92,0.38)]"
                            : "border-white/35 bg-white/74"
                      } ${isEliminating && state.eliminationTargetId === player.id ? "blur-0" : isEliminating ? "blur-[2px] opacity-45" : ""}`}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9d84ae]">Player {String.fromCharCode(65 + index)}</p>
                      <p className={`mt-2 break-words font-display text-xl font-black uppercase sm:text-2xl ${player.isAlive === false ? "line-through" : ""} text-[#2c216d]`}>
                        {player.name}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b6ea0]">
                        {player.isAlive === false ? "Eliminated" : "Alive"}
                      </p>
                    </AnimatedCard>
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
                    {discussionStarter ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[1.3rem] border border-amber-200/70 bg-gradient-to-r from-amber-100 via-white to-orange-100 px-4 py-3 shadow-[0_0_28px_rgba(251,191,36,0.28)]"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#9a6b1d]">Discussion Starter</p>
                      <motion.p
                        animate={{ opacity: [0.95, 1, 0.95] }}
                        transition={{ duration: 1.2, repeat: 2, ease: "easeInOut" }}
                        className="mt-2 font-display text-2xl font-black uppercase text-[#7a3d06] sm:text-3xl"
                      >
                        {discussionStarter.name}
                      </motion.p>
                      </motion.div>
                    ) : null}
                    <p>Give clues without saying the exact word.</p>
                    <p>
                      Discussion starts with{" "}
                      <motion.span
                        animate={discussionStarter ? { opacity: [0.85, 1, 0.85] } : { opacity: 1 }}
                        transition={{ duration: 1.1, repeat: discussionStarter ? 2 : 0, ease: "easeInOut" }}
                        className="font-black uppercase text-[#7a3d06]"
                      >
                        {discussionStarter?.name ?? "a random player"}
                      </motion.span>
                      .
                    </p>
                    <p>{isDoubleWordMode ? "If the room feels slightly mismatched, stay calm and keep listening." : meta.modeSummary}</p>
                    <p>
                      {isDoubleWordMode
                        ? "Some innocent players may sound suspicious even when they are telling the truth."
                        : isChaosMode && state.chaosVariant === "TWIN"
                        ? "Listen for tiny differences. One player is working with a similar word, not a blank guess."
                        : "Watch for vague answers or suspicious confidence."}
                    </p>
                  </>
                ) : isEliminationPhase ? (
                  <>
                    <p>Tap one alive player to cast the group vote.</p>
                    <p>Confirm the elimination and wait for the dramatic reveal.</p>
                    <p>If the imposter survives until only two players remain, the imposter wins.</p>
                  </>
                ) : (
                  <>
                    {isDoubleWordMode ? (
                      <p>The room was split by a hidden double-word twist.</p>
                    ) : (
                      <p>Secret word: {state.word}</p>
                    )}
                    {state.altWord ? <p>{isDoubleWordMode ? "Second hidden word" : "Chaos alternate word"}: {state.altWord}</p> : null}
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
        compactMobile
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
        {showFlash ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[89] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />
        ) : null}
      </AnimatePresence>

      <ImposterReveal
        isOpen={(isEliminating || showEliminationReveal) && Boolean(eliminatedPlayer) && !showAnswer && !showWinScreen}
        player={eliminatedPlayer}
        result={state.eliminationResult}
        showResult={showEliminationReveal}
        isFinalRound={state.phase === "RESULT"}
        onContinue={() => {
          setShowEliminationReveal(false);

          if (state.phase === "RESULT") {
            window.setTimeout(() => {
              setShowWinScreen(true);
            }, 140);
            return;
          }

          actions.acknowledgeElimination();
        }}
      />

      <WinScreen
        isOpen={showWinScreen && !showAnswer}
        winner={state.winner}
        winners={winningPlayers}
        onRevealAnswer={() => setShowAnswer(true)}
        onPlayAgain={() => {
          setShowWinScreen(false);
          actions.resetGame();
          navigate("/");
        }}
      />

      <Modal
        isOpen={showAnswer}
        title="Round Answer"
        fitMobileScreen
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
        {isDoubleWordMode ? (
          <PostRevealScreen primaryWord={state.word} secondaryWord={state.altWord} />
        ) : (
          <>
            <div className={`rounded-[1.35rem] bg-gradient-to-br ${meta.selectedCategory.accent} p-4 text-white shadow-[0_18px_38px_rgba(48,20,84,0.22)]`}>
              <p className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-white/90">
                {state.altWord ? "Primary Word" : "Secret Word"}
              </p>
              <p className="mt-2 w-full text-center font-display text-[2.6rem] font-black leading-none drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)] sm:text-6xl">
                {state.word}
              </p>
            </div>
            {state.altWord ? (
              <div className="rounded-[1.35rem] border border-[#d9c9ec] bg-white p-4 shadow-[0_16px_34px_rgba(77,42,120,0.12)]">
                <p className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-[#6f4f92]">Chaos Alternate Word</p>
                <p className="mt-2 w-full text-center font-display text-[2.2rem] font-black uppercase text-[#24195f] sm:text-5xl">{state.altWord}</p>
              </div>
            ) : null}
          </>
        )}
        <div className="rounded-[1.35rem] border border-[#d9c9ec] bg-white p-4 shadow-[0_16px_34px_rgba(77,42,120,0.12)]">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-[#6f4f92]">Imposter</p>
          <p className="mt-2 w-full text-center font-display text-[2.2rem] font-black uppercase text-[#24195f] sm:text-5xl">
            {imposterNames.join(", ")}
          </p>
        </div>
      </Modal>
    </PageWrapper>
  );
}
