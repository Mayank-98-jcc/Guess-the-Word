import { motion } from "framer-motion";

export default function PostRevealScreen({ primaryWord, secondaryWord }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(103,58,183,0.1),rgba(236,72,153,0.08),rgba(249,115,22,0.1))] p-5 text-center shadow-[0_18px_34px_rgba(77,42,120,0.1)]">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#7d5ba0]">Twist Reveal</p>
        <h3 className="mt-3 font-display text-3xl font-black uppercase text-[#24195f] sm:text-4xl">
          There Were Two Different Words
        </h3>
        <p className="mt-3 text-sm font-semibold text-[#6f5a87]">
          The room was split on purpose. That confusion was part of the round.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[1.75rem] border border-orange-200/60 bg-gradient-to-br from-orange-400 to-rose-400 p-5 text-white shadow-[0_18px_34px_rgba(249,115,22,0.24)]"
        >
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/80">Word A</p>
          <p className="mt-3 font-display text-4xl font-black uppercase leading-none sm:text-5xl">{primaryWord}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[1.75rem] border border-violet-200/60 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 text-white shadow-[0_18px_34px_rgba(139,92,246,0.22)]"
        >
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/80">Word B</p>
          <p className="mt-3 font-display text-4xl font-black uppercase leading-none sm:text-5xl">{secondaryWord}</p>
        </motion.div>
      </div>
    </div>
  );
}
