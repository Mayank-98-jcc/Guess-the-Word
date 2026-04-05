import AnimatedCard from "./AnimatedCard";

export default function CategoryCard({ category, isSelected, onSelect, wordCount }) {
  return (
    <AnimatedCard
      as="button"
      type="button"
      interactive
      selected={isSelected}
      onClick={() => onSelect(category.key)}
      whileHover={{ y: -5, scale: isSelected ? 1.04 : 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`glow-card neon-outline relative h-full w-full overflow-hidden rounded-[1.8rem] border p-3 text-left backdrop-blur-xl ${
        isSelected ? "border-white/90 ring-2 ring-orange-200/90" : "border-white/45"
      }`}
    >
      <div className="absolute inset-0 rounded-[1.8rem] bg-white/18" />
      <div className="panel-sheen rounded-[1.8rem]" />
      <div className={`relative flex h-full min-h-[11.5rem] flex-col rounded-[1.45rem] bg-gradient-to-br ${category.accent} p-5 text-white`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-white/80">Category</p>
            <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none">{category.label}</h3>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/20 text-3xl shadow-inner">
            {category.emoji}
          </span>
        </div>
        <p className="mt-3 text-sm font-medium text-white/88">Ex: {category.preview}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-bold">
          <span className="rounded-full bg-white/24 px-3 py-1.5 text-white/95">{wordCount} words</span>
          <span className="rounded-full bg-white/78 px-3 py-1.5 text-slate-700">Ex: {category.preview}</span>
        </div>
      </div>
    </AnimatedCard>
  );
}
