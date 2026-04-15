import { AnimatePresence, motion } from "framer-motion";
import { getPlayerBadgeMap } from "../features/game/playerBadges";

export default function PlayerChip({ player, players = [player], onRemove }) {
  const badge = getPlayerBadgeMap(players)[player.id] ?? player.name.slice(0, 1).toUpperCase();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.6, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.6, y: -10 }}
        className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-2 py-2 text-sm font-bold text-slate-800 shadow-[0_12px_24px_rgba(116,52,172,0.12)] backdrop-blur-md"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-orange-300 via-pink-300 to-violet-400 text-xs font-black uppercase text-white shadow-[0_6px_14px_rgba(197,93,191,0.35)]">
          {badge}
        </span>
        <span className="pr-2">{player.name}</span>
        <button
          type="button"
          onClick={() => onRemove(player.id)}
          className="grid h-6 w-6 place-items-center rounded-full bg-white/80 text-[11px] text-slate-600 shadow-sm"
          aria-label={`Remove ${player.name}`}
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
