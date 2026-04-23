import { motion } from "framer-motion";

const confettiBits = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  left: 42 + ((index % 7) - 3) * 6,
  delay: index * 0.05,
  duration: 2.8 + (index % 4) * 0.35,
  size: 8 + (index % 3) * 5,
  rotate: (index % 2 === 0 ? 1 : -1) * (160 + index * 12),
  color: ["#ff9f43", "#ff4fa3", "#8b5cf6", "#38bdf8", "#fde047"][index % 5],
}));

export default function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {confettiBits.map((bit) => (
        <motion.span
          key={bit.id}
          className="absolute top-[12%] block rounded-sm"
          style={{
            left: `${bit.left}%`,
            width: bit.size,
            height: bit.size * 1.6,
            background: bit.color,
          }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: [0, 140, 320, 520],
            x: [0, (bit.id % 2 === 0 ? 1 : -1) * 24, (bit.id % 3 === 0 ? -1 : 1) * 42],
            rotate: [0, bit.rotate * 0.35, bit.rotate],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: bit.duration - 0.5,
            delay: 0.35 + bit.delay,
            repeat: 0,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
