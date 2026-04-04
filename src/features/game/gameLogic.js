import { categories } from "./words";

const ROLES = {
  CREWMATE: "CREWMATE",
  IMPOSTER: "IMPOSTER",
};

export const GAME_PHASES = {
  SETUP: "SETUP",
  REVEAL: "REVEAL",
  DISCUSS: "DISCUSS",
  ELIMINATION: "ELIMINATION",
  RESULT: "RESULT",
};

export function createPlayer(name) {
  return {
    id: `player-${Math.random().toString(36).slice(2, 9)}`,
    name,
    role: null,
  };
}

export function assignImposters(players, count) {
  const pool = [...players];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool.slice(0, Math.min(count, Math.max(players.length - 1, 1))).map((player) => player.id);
}

export function getRandomWord(category) {
  const categoryWords = categories[category] ?? categories.food;
  return categoryWords[Math.floor(Math.random() * categoryWords.length)];
}

export function startGame(players, category, imposterCount, previousState = {}) {
  const wordEntry = getRandomWord(category);
  const imposters = assignImposters(players, imposterCount);

  return {
    ...previousState,
    word: wordEntry.word,
    wordHint: wordEntry.hint,
    imposters,
    currentPlayerIndex: 0,
    phase: GAME_PHASES.REVEAL,
    discussionStartedAt: null,
    selectedPlayer: null,
    eliminationTargetId: null,
    eliminationResult: null,
    winner: null,
    players: players.map((player) => ({
      ...player,
      role: imposters.includes(player.id) ? ROLES.IMPOSTER : ROLES.CREWMATE,
      isAlive: true,
    })),
  };
}

export function nextPlayer(currentIndex, totalPlayers) {
  if (!totalPlayers) {
    return 0;
  }

  return (currentIndex + 1) % totalPlayers;
}

export function resetGame(previousState = {}) {
  return {
    ...previousState,
    currentPlayerIndex: 0,
    word: "",
    wordHint: "",
    imposters: [],
    phase: GAME_PHASES.SETUP,
    discussionStartedAt: null,
    selectedPlayer: null,
    eliminationTargetId: null,
    eliminationResult: null,
    winner: null,
    players: (previousState.players ?? []).map((player) => ({
      ...player,
      role: null,
      isAlive: true,
    })),
  };
}

export function getAvailableImposterOptions(playerCount) {
  const maxImposters = Math.max(1, Math.min(3, Math.floor(playerCount / 2)));
  return Array.from({ length: maxImposters }, (_, index) => index + 1);
}

export function getCategoryWordCount(category) {
  return (categories[category] ?? []).length;
}

export function getAlivePlayers(players = []) {
  return players.filter((player) => player.isAlive !== false);
}

export function checkGameEnd(players = []) {
  const alivePlayers = getAlivePlayers(players);
  const aliveImposters = alivePlayers.filter((player) => player.role === ROLES.IMPOSTER);

  if (!aliveImposters.length) {
    return {
      winner: "CREW",
      reason: "IMPOSTER_ELIMINATED",
    };
  }

  if (alivePlayers.length <= 2) {
    return {
      winner: "IMPOSTER",
      reason: "ONLY_TWO_LEFT",
    };
  }

  return null;
}

export function eliminatePlayer(players = [], playerId) {
  const updatedPlayers = players.map((player) =>
    player.id === playerId
      ? {
          ...player,
          isAlive: false,
        }
      : player,
  );
  const eliminatedPlayer = updatedPlayers.find((player) => player.id === playerId) ?? null;
  const endState = checkGameEnd(updatedPlayers);

  return {
    players: updatedPlayers,
    eliminatedPlayer,
    outcome: eliminatedPlayer
      ? eliminatedPlayer.role === ROLES.IMPOSTER
        ? "IMPOSTER_ELIMINATED"
        : "INNOCENT_ELIMINATED"
      : null,
    endState,
  };
}
