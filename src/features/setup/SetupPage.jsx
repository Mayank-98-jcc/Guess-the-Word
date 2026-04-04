import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import CategoryCard from "../../components/CategoryCard";
import { categoryDetails } from "../game/categories";
import { categories } from "../game/words";
import { useGame } from "../../hooks/useGame";

const timerOptions = [60, 120, 180, 300];

export default function SetupPage() {
  const { state, meta, actions, navigate } = useGame();
  const [playerName, setPlayerName] = useState("");
  const canStart = state.players.length >= 3;

  const featuredCategories = useMemo(
    () => ["food", "jobs", "animals", "sports"].map((key) => categoryDetails[key]),
    [],
  );

  const handleAddPlayer = (event) => {
    event.preventDefault();

    if (!playerName.trim()) {
      return;
    }

    actions.addPlayer(playerName.trim());
    setPlayerName("");
  };

  const handleStart = () => {
    actions.startRound();
  };

  useEffect(() => {
    if (state.phase === "REVEAL") {
      navigate("/reveal");
    }
  }, [navigate, state.phase]);

  return (
    <motion.main
      className="app-shell"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="sparkle-field" />
      <motion.div
        className="orb left-[-4rem] top-28 h-44 w-44 bg-orange-300/55"
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="orb right-[-3rem] top-16 h-52 w-52 bg-violet-300/55"
        animate={{ x: [0, -20, 0], y: [0, 22, 0] }}
        transition={{ duration: 11, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="orb bottom-8 right-1/4 h-40 w-40 bg-pink-300/40"
        animate={{ x: [0, 16, 0], y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.button
          type="button"
          whileHover={{ rotate: 18, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white/18 text-xl text-white shadow-[0_12px_30px_rgba(118,52,168,0.28)] backdrop-blur-md sm:right-8 sm:top-5 sm:h-14 sm:w-14 sm:text-2xl"
        >
          ⚙
        </motion.button>

        <section className="mx-auto w-full max-w-4xl text-center">
          <motion.p
            className="text-stroke-title text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Play With Friends
          </motion.p>
          <motion.h1
            className="hero-title mt-4 font-display text-5xl font-black uppercase leading-[0.84] text-white sm:text-6xl md:text-8xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.14, duration: 0.45 }}
          >
            Imposter
            <span className="block">Who?</span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-xl px-2 text-sm font-semibold text-white/90 sm:mt-5 sm:text-base md:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Pass one phone, reveal one secret word, and expose the player faking it.
          </motion.p>
        </section>

        <div className="mx-auto mt-8 grid w-full max-w-5xl gap-5 sm:gap-6 lg:mt-10 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.section
            className="glass-panel glass-panel-strong screen-glow relative overflow-hidden p-5 sm:p-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45 }}
          >
            <div className="panel-sheen" />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-500">Players</p>
                <h2 className="mt-1 font-display text-2xl font-black uppercase text-[#4d2455] sm:text-3xl">Build the party</h2>
              </div>
              <div className="rounded-full bg-white/65 px-3 py-2 text-xs font-black uppercase text-[#87506b] shadow-[0_8px_20px_rgba(132,52,162,0.12)] sm:px-4 sm:text-sm">
                {state.players.length} joined
              </div>
            </div>

            <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleAddPlayer}>
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Enter player name"
                className="min-w-0 flex-1 rounded-full border border-white/70 bg-white/50 px-5 py-3 text-base font-semibold text-[#5c345e] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none backdrop-blur-md placeholder:text-[#8e6c98] focus:border-white"
              />
              <Button type="submit" className="w-full sm:min-w-[96px] sm:w-auto">Add</Button>
            </form>

            <div className="frosted-inner mt-5 rounded-[1.75rem] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#936486]">Crew List</p>
                <span className="text-xs font-semibold text-[#8d6d90] sm:text-sm">Need at least 3 players</span>
              </div>
              <div className="mt-4 flex min-h-24 flex-wrap gap-3">
                <AnimatePresence>
                  {state.players.length ? (
                    <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                      {state.players.map((player, index) => (
                        <motion.div
                          key={player.id}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.04 }}
                          className="text-center"
                        >
                          <button
                            type="button"
                            onClick={() => actions.removePlayer(player.id)}
                            className="group"
                            aria-label={`Remove ${player.name}`}
                          >
                            <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/70 bg-gradient-to-br from-orange-300 via-pink-400 to-violet-500 text-base font-black uppercase text-white shadow-[0_10px_22px_rgba(171,77,190,0.28)] transition group-hover:scale-105">
                              {player.name.slice(0, 1)}
                            </span>
                          </button>
                          <p className="mt-2 max-w-[4.5rem] truncate text-xs font-semibold text-[#7c5a81]">{player.name}</p>
                        </motion.div>
                      ))}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-white/75 px-4 py-3 text-sm font-black text-[#a36aa1] shadow-[0_10px_24px_rgba(122,48,162,0.1)]"
                      >
                        + Add
                      </motion.button>
                    </div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium text-[#8d6d90]"
                    >
                      Add a few names to get the round ready.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="frosted-inner rounded-[1.75rem] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#936486]">Imposters</p>
                    <h3 className="mt-2 font-display text-xl font-black uppercase text-[#4d2455] sm:text-2xl">
                      {state.imposterCount} {state.imposterCount === 1 ? "Imposter" : "Imposters"}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {meta.availableImposterOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => actions.updateImposterCount(option)}
                        className={`grid h-11 w-11 place-items-center rounded-full text-sm font-black shadow-[0_8px_18px_rgba(122,48,162,0.12)] ${
                          state.imposterCount === option
                            ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                            : "bg-white/80 text-[#5f3567]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="frosted-inner rounded-[1.75rem] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#936486]">Time Limit</p>
                    <h3 className="mt-2 font-display text-xl font-black uppercase text-[#4d2455] sm:text-2xl">
                      {state.timerEnabled ? `${Math.floor(state.timerSeconds / 60)} min` : "Disabled"}
                    </h3>
                  </div>
                  <motion.button
                    type="button"
                    onClick={actions.toggleTimer}
                    whileTap={{ scale: 0.96 }}
                    className={`relative h-10 w-20 rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)] transition ${
                      state.timerEnabled
                        ? "bg-gradient-to-r from-orange-400 to-pink-500"
                        : "bg-white/70"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-[0_10px_20px_rgba(255,126,86,0.35)] transition ${
                        state.timerEnabled ? "left-11" : "left-1"
                      }`}
                    />
                  </motion.button>
                </div>

                {state.timerEnabled ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {timerOptions.map((seconds) => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => actions.updateTimerSeconds(seconds)}
                        className={`rounded-full px-4 py-2 text-sm font-black uppercase shadow-[0_8px_18px_rgba(122,48,162,0.12)] ${
                          state.timerSeconds === seconds
                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
                            : "bg-white/75 text-[#6a4a74]"
                        }`}
                      >
                        {seconds / 60} min
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="mt-6 w-full py-4 text-base sm:text-xl disabled:opacity-50"
              icon="▶"
            >
              Start Game
            </Button>
          </motion.section>

          <motion.section
            className="space-y-5"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.45 }}
          >
            <div className="glass-panel glass-panel-strong screen-glow relative overflow-hidden p-5 sm:p-6">
              <div className="panel-sheen" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-500">Categories</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl font-black uppercase text-[#4d2455] sm:text-3xl">Pick the category</h2>
                      <p className="mt-2 text-sm font-medium text-[#835e85]">
                        Choose category for the round. Every crewmate gets the same word.
                      </p>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 18, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/60 text-xl shadow-[0_8px_18px_rgba(122,48,162,0.12)]"
                >
                  ⚙
                </motion.div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featuredCategories.map((category, index) => (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 + index * 0.05 }}
                >
                  <CategoryCard
                    category={category}
                    isSelected={state.category === category.key}
                    onSelect={actions.updateCategory}
                    wordCount={(categories[category.key] ?? []).length}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </motion.main>
  );
}
