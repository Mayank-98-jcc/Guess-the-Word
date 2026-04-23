import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  createPlayer,
  eliminatePlayer as eliminatePlayerFromGame,
  GAME_PHASES,
  GAME_MODES,
  getAvailableImposterOptions,
  getAlivePlayers,
  getCategoryWordCount,
  getModeHintLabel,
  getModeSummary,
  getRandomAlivePlayer,
  getRandomCategory,
  getRandomWord,
  nextPlayer as getNextPlayerIndex,
  checkGameEnd,
  startGame,
} from "../features/game/gameLogic";
import { getCategoryDetail } from "../features/game/categories";

export const GameContext = createContext(null);

const initialState = {
  players: [],
  currentPlayerIndex: 0,
  mode: GAME_MODES.MEDIUM,
  word: "",
  altWord: "",
  wordHint: "",
  imposters: [],
  chaosVariant: null,
  category: "food",
  lastRoundCategory: null,
  imposterCount: 1,
  timerEnabled: false,
  timerSeconds: 180,
  phase: GAME_PHASES.SETUP,
  discussionStartedAt: null,
  discussionStarterId: null,
  selectedPlayer: null,
  eliminationTargetId: null,
  eliminationResult: null,
  winner: null,
};

export function GameProvider({ children }) {
  const [state, setState] = useState(initialState);

  const addPlayer = useCallback((name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      players: [...currentState.players, createPlayer(trimmedName)],
    }));
  }, []);

  const removePlayer = useCallback((playerId) => {
    setState((currentState) => ({
      ...currentState,
      players: currentState.players.filter((player) => player.id !== playerId),
      imposterCount: Math.min(
        currentState.imposterCount,
        getAvailableImposterOptions(currentState.players.length - 1).slice(-1)[0] ?? 1,
      ),
    }));
  }, []);

  const reorderPlayers = useCallback((players) => {
    setState((currentState) => ({
      ...currentState,
      players,
      currentPlayerIndex: Math.min(currentState.currentPlayerIndex, Math.max(players.length - 1, 0)),
    }));
  }, []);

  const updateCategory = useCallback((category) => {
    setState((currentState) => ({
      ...currentState,
      category,
    }));
  }, []);

  const updateMode = useCallback((mode) => {
    setState((currentState) => ({
      ...currentState,
      mode,
      imposterCount: mode === GAME_MODES.CHAOS || mode === GAME_MODES.DOUBLE_WORD ? 1 : currentState.imposterCount,
    }));
  }, []);

  const updateImposterCount = useCallback((imposterCount) => {
    setState((currentState) => ({
      ...currentState,
      imposterCount,
    }));
  }, []);

  const toggleTimer = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      timerEnabled: !currentState.timerEnabled,
    }));
  }, []);

  const updateTimerSeconds = useCallback((timerSeconds) => {
    setState((currentState) => ({
      ...currentState,
      timerSeconds,
    }));
  }, []);

  const startRound = useCallback(() => {
    if (state.players.length < 3) {
      return false;
    }

    setState((currentState) => {
      const nextCategory = getRandomCategory(undefined, currentState.lastRoundCategory);

      return startGame(currentState.players, nextCategory, currentState.imposterCount, currentState);
    });

    return true;
  }, [state.players.length]);

  const nextPlayer = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      currentPlayerIndex: getNextPlayerIndex(currentState.currentPlayerIndex, currentState.players.length),
    }));
  }, []);

  const beginDiscussion = useCallback(() => {
    setState((currentState) => {
      const randomStarter = getRandomAlivePlayer(currentState.players) ?? currentState.players[0] ?? null;

      return {
        ...currentState,
        phase: GAME_PHASES.DISCUSS,
        discussionStartedAt: Date.now(),
        discussionStarterId: currentState.discussionStarterId ?? randomStarter?.id ?? null,
        selectedPlayer: null,
        eliminationTargetId: null,
        eliminationResult: null,
      };
    });
  }, []);

  const startElimination = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      phase: GAME_PHASES.ELIMINATION,
      selectedPlayer: null,
      eliminationTargetId: null,
      eliminationResult: null,
    }));
  }, []);

  const selectPlayer = useCallback((playerId) => {
    setState((currentState) => ({
      ...currentState,
      selectedPlayer: playerId,
    }));
  }, []);

  const clearSelectedPlayer = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      selectedPlayer: null,
    }));
  }, []);

  const eliminateSelectedPlayer = useCallback(() => {
    setState((currentState) => {
      if (!currentState.selectedPlayer) {
        return currentState;
      }

      const { players, eliminatedPlayer, outcome, endState } = eliminatePlayerFromGame(
        currentState.players,
        currentState.selectedPlayer,
      );
      const shouldRotateDiscussionStarter =
        !endState &&
        eliminatedPlayer?.role !== "IMPOSTER" &&
        eliminatedPlayer?.id === currentState.discussionStarterId;
      const nextDiscussionStarter = shouldRotateDiscussionStarter
        ? getRandomAlivePlayer(players, eliminatedPlayer.id)
        : null;

      return {
        ...currentState,
        players,
        discussionStarterId: shouldRotateDiscussionStarter
          ? nextDiscussionStarter?.id ?? null
          : currentState.discussionStarterId,
        eliminationTargetId: eliminatedPlayer?.id ?? null,
        eliminationResult: outcome,
        selectedPlayer: null,
        winner: endState?.winner ?? null,
        phase: endState ? GAME_PHASES.RESULT : GAME_PHASES.ELIMINATION,
      };
    });
  }, []);

  const acknowledgeElimination = useCallback(() => {
    setState((currentState) => {
      if (currentState.winner) {
        return currentState;
      }

      return {
        ...currentState,
        phase: GAME_PHASES.DISCUSS,
        eliminationTargetId: null,
        eliminationResult: null,
        discussionStartedAt: Date.now(),
        discussionStarterId: currentState.discussionStarterId ?? getRandomAlivePlayer(currentState.players)?.id ?? null,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState((currentState) => ({
      ...initialState,
      players: currentState.players.map((player) => ({
        ...player,
        role: null,
        secretWord: "",
        secretHint: "",
        isAlive: true,
      })),
      mode: currentState.mode,
      category: currentState.category,
      lastRoundCategory: currentState.lastRoundCategory,
      imposterCount: Math.min(currentState.imposterCount, getAvailableImposterOptions(currentState.players.length).slice(-1)[0] ?? 1),
      timerEnabled: currentState.timerEnabled,
      timerSeconds: currentState.timerSeconds,
    }));
  }, []);

  const currentPlayer = useMemo(() => state.players[state.currentPlayerIndex] ?? null, [state.currentPlayerIndex, state.players]);
  const alivePlayers = useMemo(() => getAlivePlayers(state.players), [state.players]);
  const availableImposterOptions = useMemo(
    () => getAvailableImposterOptions(state.players.length),
    [state.players.length],
  );
  const selectedCategory = useMemo(() => getCategoryDetail(state.category), [state.category]);
  const selectedWordPreview = useMemo(() => getRandomWord(state.category), [state.category]);

  const providerState = useMemo(
    () => ({
      ...state,
      currentPlayer,
      alivePlayers,
    }),
    [alivePlayers, currentPlayer, state],
  );

  const meta = useMemo(
    () => ({
      availableImposterOptions,
      selectedCategory,
      selectedWordPreview,
      wordCount: getCategoryWordCount(state.category),
      endState: checkGameEnd(state.players),
      modeSummary: getModeSummary(state.mode, state),
      modeHintLabel: getModeHintLabel(state.mode),
    }),
    [availableImposterOptions, selectedCategory, selectedWordPreview, state],
  );

  const actions = useMemo(
    () => ({
      addPlayer,
      removePlayer,
      reorderPlayers,
      updateCategory,
      updateMode,
      updateImposterCount,
      toggleTimer,
      updateTimerSeconds,
      startRound,
      nextPlayer,
      beginDiscussion,
      startElimination,
      selectPlayer,
      clearSelectedPlayer,
      eliminateSelectedPlayer,
      acknowledgeElimination,
      resetGame,
    }),
    [
      acknowledgeElimination,
      addPlayer,
      beginDiscussion,
      clearSelectedPlayer,
      eliminateSelectedPlayer,
      nextPlayer,
      removePlayer,
      reorderPlayers,
      resetGame,
      selectPlayer,
      startElimination,
      startRound,
      toggleTimer,
      updateCategory,
      updateImposterCount,
      updateMode,
      updateTimerSeconds,
    ],
  );

  const value = useMemo(
    () => ({
      state: providerState,
      meta,
      actions,
    }),
    [actions, meta, providerState],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  return context;
}
