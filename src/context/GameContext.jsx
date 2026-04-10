import { createContext, useContext, useMemo, useState } from "react";
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
  selectedPlayer: null,
  eliminationTargetId: null,
  eliminationResult: null,
  winner: null,
};

export function GameProvider({ children }) {
  const [state, setState] = useState(initialState);

  const addPlayer = (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      players: [...currentState.players, createPlayer(trimmedName)],
    }));
  };

  const removePlayer = (playerId) => {
    setState((currentState) => ({
      ...currentState,
      players: currentState.players.filter((player) => player.id !== playerId),
      imposterCount: Math.min(
        currentState.imposterCount,
        getAvailableImposterOptions(currentState.players.length - 1).slice(-1)[0] ?? 1,
      ),
    }));
  };

  const updateCategory = (category) => {
    setState((currentState) => ({
      ...currentState,
      category,
    }));
  };

  const updateMode = (mode) => {
    setState((currentState) => ({
      ...currentState,
      mode,
      imposterCount: mode === GAME_MODES.CHAOS || mode === GAME_MODES.DOUBLE_WORD ? 1 : currentState.imposterCount,
    }));
  };

  const updateImposterCount = (imposterCount) => {
    setState((currentState) => ({
      ...currentState,
      imposterCount,
    }));
  };

  const toggleTimer = () => {
    setState((currentState) => ({
      ...currentState,
      timerEnabled: !currentState.timerEnabled,
    }));
  };

  const updateTimerSeconds = (timerSeconds) => {
    setState((currentState) => ({
      ...currentState,
      timerSeconds,
    }));
  };

  const startRound = () => {
    if (state.players.length < 3) {
      return false;
    }

    setState((currentState) => {
      const nextCategory = getRandomCategory(undefined, currentState.lastRoundCategory);

      return startGame(currentState.players, nextCategory, currentState.imposterCount, currentState);
    });

    return true;
  };

  const nextPlayer = () => {
    setState((currentState) => ({
      ...currentState,
      currentPlayerIndex: getNextPlayerIndex(currentState.currentPlayerIndex, currentState.players.length),
    }));
  };

  const beginDiscussion = () => {
    setState((currentState) => ({
      ...currentState,
      phase: GAME_PHASES.DISCUSS,
      discussionStartedAt: Date.now(),
      selectedPlayer: null,
      eliminationTargetId: null,
      eliminationResult: null,
    }));
  };

  const startElimination = () => {
    setState((currentState) => ({
      ...currentState,
      phase: GAME_PHASES.ELIMINATION,
      selectedPlayer: null,
      eliminationTargetId: null,
      eliminationResult: null,
    }));
  };

  const selectPlayer = (playerId) => {
    setState((currentState) => ({
      ...currentState,
      selectedPlayer: playerId,
    }));
  };

  const clearSelectedPlayer = () => {
    setState((currentState) => ({
      ...currentState,
      selectedPlayer: null,
    }));
  };

  const eliminateSelectedPlayer = () => {
    setState((currentState) => {
      if (!currentState.selectedPlayer) {
        return currentState;
      }

      const { players, eliminatedPlayer, outcome, endState } = eliminatePlayerFromGame(
        currentState.players,
        currentState.selectedPlayer,
      );

      return {
        ...currentState,
        players,
        eliminationTargetId: eliminatedPlayer?.id ?? null,
        eliminationResult: outcome,
        selectedPlayer: null,
        winner: endState?.winner ?? null,
        phase: endState ? GAME_PHASES.RESULT : GAME_PHASES.ELIMINATION,
      };
    });
  };

  const acknowledgeElimination = () => {
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
      };
    });
  };

  const resetGame = () => {
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
  };

  const currentPlayer = useMemo(() => state.players[state.currentPlayerIndex] ?? null, [state.currentPlayerIndex, state.players]);
  const alivePlayers = useMemo(() => getAlivePlayers(state.players), [state.players]);
  const availableImposterOptions = useMemo(
    () => getAvailableImposterOptions(state.players.length),
    [state.players.length],
  );
  const selectedCategory = useMemo(() => getCategoryDetail(state.category), [state.category]);
  const selectedWordPreview = useMemo(() => getRandomWord(state.category), [state.category]);

  const value = {
    state: {
      ...state,
      currentPlayer,
      alivePlayers,
    },
    meta: {
      availableImposterOptions,
      selectedCategory,
      selectedWordPreview,
      wordCount: getCategoryWordCount(state.category),
      endState: checkGameEnd(state.players),
      modeSummary: getModeSummary(state.mode, state),
      modeHintLabel: getModeHintLabel(state.mode),
    },
    actions: {
      addPlayer,
      removePlayer,
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
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  return context;
}
