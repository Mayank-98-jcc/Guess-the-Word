import { categories, getRandomChaosPair, getRandomDoubleWordPair, getRandomWord } from "./words";

export { getRandomWord } from "./words";

const ROLES = {
  CREWMATE: "CREWMATE",
  IMPOSTER: "IMPOSTER",
};

export const GAME_MODES = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  CHAOS: "CHAOS",
  DOUBLE_WORD: "DOUBLE_WORD",
};

const CHAOS_VARIANTS = {
  DOUBLE: "DOUBLE",
  TWIN: "TWIN",
};

export const GAME_PHASES = {
  SETUP: "SETUP",
  REVEAL: "REVEAL",
  DISCUSS: "DISCUSS",
  ELIMINATION: "ELIMINATION",
  RESULT: "RESULT",
};

const MODE_HINT_LABELS = {
  [GAME_MODES.EASY]: "Clear Hint",
  [GAME_MODES.MEDIUM]: "Abstract Hint",
  [GAME_MODES.HARD]: "No Hint",
  [GAME_MODES.CHAOS]: "Chaos Intel",
  [GAME_MODES.DOUBLE_WORD]: "Hidden Split",
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

function shufflePlayers(players) {
  const pool = [...players];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool;
}

export function getRandomCategory(categoriesMap = categories) {
  const categoryKeys = Object.keys(categoriesMap);
  return categoryKeys[Math.floor(Math.random() * categoryKeys.length)] ?? "food";
}

function getModeAwareHint(mode, wordEntry, category) {
  if (mode === GAME_MODES.HARD) {
    return "";
  }

  if (mode === GAME_MODES.EASY) {
    return `${wordEntry.hint} ${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  }

  return wordEntry.hint;
}

function buildRoundPlayers(players, imposters, word, hint, altWord = "", altHint = "") {
  return players.map((player) => {
    const isImposter = imposters.includes(player.id);

    return {
      ...player,
      role: isImposter ? ROLES.IMPOSTER : ROLES.CREWMATE,
      isAlive: true,
      secretWord: isImposter && altWord ? altWord : word,
      secretHint: isImposter ? altHint || hint : "",
    };
  });
}

function buildDoubleWordRoundPlayers(players, imposterId, pair) {
  const crewmates = shufflePlayers(players.filter((player) => player.id !== imposterId));
  const groupAIds = new Set(crewmates.filter((_, index) => index % 2 === 0).map((player) => player.id));

  return players.map((player) => {
    const isImposter = player.id === imposterId;
    const assignedWord = groupAIds.has(player.id) ? pair.wordA : pair.wordB;

    return {
      ...player,
      role: isImposter ? ROLES.IMPOSTER : ROLES.CREWMATE,
      isAlive: true,
      secretWord: isImposter ? "" : assignedWord,
      secretHint: "",
    };
  });
}

function createModeRound(players, category, imposterCount, mode) {
  if (mode === GAME_MODES.DOUBLE_WORD) {
    const pair = getRandomDoubleWordPair(category);
    const [imposterId] = assignImposters(players, 1);

    return {
      word: pair.wordA,
      altWord: pair.wordB,
      wordHint: "",
      imposters: imposterId ? [imposterId] : [],
      chaosVariant: null,
      players: buildDoubleWordRoundPlayers(players, imposterId, pair),
    };
  }

  if (mode !== GAME_MODES.CHAOS) {
    const wordEntry = getRandomWord(category);
    const imposters = assignImposters(players, imposterCount);
    const hint = getModeAwareHint(mode, wordEntry, category);

    return {
      word: wordEntry.word,
      altWord: "",
      wordHint: hint,
      imposters,
      chaosVariant: null,
      players: buildRoundPlayers(players, imposters, wordEntry.word, hint, "", ""),
    };
  }

  const canUseDoubleImposters = players.length >= 5;
  const useDoubleImposters = canUseDoubleImposters && Math.random() > 0.5;

  if (useDoubleImposters) {
    const wordEntry = getRandomWord(category);
    const imposters = assignImposters(players, Math.max(2, imposterCount));

    return {
      word: wordEntry.word,
      altWord: "",
      wordHint: wordEntry.hint,
      imposters,
      chaosVariant: CHAOS_VARIANTS.DOUBLE,
      players: buildRoundPlayers(players, imposters, wordEntry.word, wordEntry.hint, "", wordEntry.hint),
    };
  }

  const pair = getRandomChaosPair(category);
  const imposters = assignImposters(players, 1);

  return {
    word: pair.word,
    altWord: pair.altWord,
    wordHint: pair.word,
    imposters,
    chaosVariant: CHAOS_VARIANTS.TWIN,
    players: buildRoundPlayers(players, imposters, pair.word, "", pair.altWord, "Different, but close"),
  };
}

export function startGame(players, category, imposterCount, previousState = {}) {
  const chosenCategory = category || getRandomCategory();
  const mode = previousState.mode ?? GAME_MODES.MEDIUM;
  const round = createModeRound(players, chosenCategory, imposterCount, mode);

  return {
    ...previousState,
    category: chosenCategory,
    word: round.word,
    altWord: round.altWord,
    wordHint: round.wordHint,
    imposters: round.imposters,
    chaosVariant: round.chaosVariant,
    currentPlayerIndex: 0,
    phase: GAME_PHASES.REVEAL,
    discussionStartedAt: null,
    selectedPlayer: null,
    eliminationTargetId: null,
    eliminationResult: null,
    winner: null,
    players: round.players,
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
    altWord: "",
    wordHint: "",
    imposters: [],
    chaosVariant: null,
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
      secretWord: "",
      secretHint: "",
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

export function getModeSummary(mode, state) {
  if (mode === GAME_MODES.DOUBLE_WORD) {
    return "The room is secretly split between two similar words, and only the imposter sees nothing.";
  }

  if (mode === GAME_MODES.CHAOS) {
    return state.chaosVariant === CHAOS_VARIANTS.DOUBLE
      ? "Two imposters are loose in the room."
      : `A false lead is hiding behind ${state.altWord}.`;
  }

  if (mode === GAME_MODES.HARD) {
    return "Imposters get no hint. Pure bluffing only.";
  }

  if (mode === GAME_MODES.EASY) {
    return "Imposters get a clearer clue and extra breathing room.";
  }

  return "Imposters get a single abstract hint.";
}

export function getModeHintLabel(mode) {
  return MODE_HINT_LABELS[mode] ?? MODE_HINT_LABELS[GAME_MODES.MEDIUM];
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
