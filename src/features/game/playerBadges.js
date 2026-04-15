function normalizeName(name = "") {
  return name.trim().toLowerCase().replace(/\s+/g, "");
}

function getUniquePrefix(normalizedName, normalizedNames) {
  for (let length = 1; length <= normalizedName.length; length += 1) {
    const prefix = normalizedName.slice(0, length);
    const hasConflict = normalizedNames.some(
      (candidate) => candidate !== normalizedName && candidate.startsWith(prefix),
    );

    if (!hasConflict) {
      return prefix;
    }
  }

  return normalizedName;
}

export function getPlayerBadgeMap(players = []) {
  const normalizedNames = players.map((player) => normalizeName(player.name)).filter(Boolean);
  const duplicateCounts = new Map();

  return players.reduce((badgeMap, player) => {
    const trimmedName = player.name.trim();
    const normalizedName = normalizeName(trimmedName);

    if (!normalizedName) {
      badgeMap[player.id] = "?";
      return badgeMap;
    }

    const occurrences = normalizedNames.filter((name) => name === normalizedName).length;
    const duplicateIndex = (duplicateCounts.get(normalizedName) ?? 0) + 1;
    duplicateCounts.set(normalizedName, duplicateIndex);

    if (occurrences > 1) {
      badgeMap[player.id] = `${trimmedName.slice(0, 2) || trimmedName.slice(0, 1)}${duplicateIndex}`.toUpperCase();
      return badgeMap;
    }

    badgeMap[player.id] = getUniquePrefix(normalizedName, normalizedNames).slice(0, 3).toUpperCase();
    return badgeMap;
  }, {});
}
