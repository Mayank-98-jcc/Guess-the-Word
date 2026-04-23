import { motion } from "framer-motion";

export default function PostRevealScreen({ primaryWord, secondaryWord }) {
  return (
    <div className="space-y-3">
      <div className="rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(103,58,183,0.1),rgba(236,72,153,0.08),rgba(249,115,22,0.1))] p-4 text-center shadow-[0_18px_34px_rgba(77,42,120,0.1)]">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#7d5ba0]">Twist Reveal</p>
        <h3 className="mt-2 font-display text-[2rem] font-black uppercase leading-[0.95] text-[#24195f] sm:text-4xl">
          There Were Two Different Words
        </h3>
        <p className="mt-2 text-[0.92rem] font-semibold leading-snug text-[#6f5a87]">
          The room was split on purpose. That confusion was part of the round.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[1.35rem] border border-orange-200/60 bg-gradient-to-br from-orange-400 to-rose-400 p-4 text-white shadow-[0_18px_34px_rgba(249,115,22,0.24)]"
        >
          <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-white/80">Word A</p>
          <p className="mt-2 w-full text-center font-display text-[2.4rem] font-black uppercase leading-none sm:text-5xl">{primaryWord}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[1.35rem] border border-violet-200/60 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-4 text-white shadow-[0_18px_34px_rgba(139,92,246,0.22)]"
        >
          <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-white/80">Word B</p>
          <p className="mt-2 w-full text-center font-display text-[2.4rem] font-black uppercase leading-none sm:text-5xl">{secondaryWord}</p>
        </motion.div>
      </div>
    </div>
  );
}
