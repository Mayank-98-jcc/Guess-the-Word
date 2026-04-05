import { motion } from "framer-motion";

const bursts = [
  { id: 1, top: "20%", left: "22%", color: "#ff7f50", delay: 0.2 },
  { id: 2, top: "26%", left: "76%", color: "#f472b6", delay: 0.9 },
  { id: 3, top: "16%", left: "56%", color: "#38bdf8", delay: 1.5 },
];

const rays = Array.from({ length: 10 }, (_, index) => index);

export default function Fireworks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bursts.map((burst) => (
        <motion.div
          key={burst.id}
          className="absolute"
          style={{ top: burst.top, left: burst.left }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.1, 1.6] }}
          transition={{
            duration: 1.4,
            delay: burst.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2.2,
            ease: "easeOut",
          }}
        >
          {rays.map((ray) => (
            <span
              key={ray}
              className="absolute left-0 top-0 h-16 w-[3px] origin-bottom rounded-full"
              style={{
                background: `linear-gradient(180deg, ${burst.color}, transparent)`,
                transform: `rotate(${ray * 36}deg) translateY(-16px)`,
              }}
            />
          ))}
          <span
            className="absolute left-0 top-0 h-10 w-10 rounded-full blur-md"
            style={{ background: burst.color, transform: "translate(-50%, -50%)", opacity: 0.45 }}
          />
        </motion.div>
      ))}
    </div>
  );
}
