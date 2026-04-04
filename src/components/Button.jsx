import { motion } from "framer-motion";

export default function Button({
  children,
  className = "",
  variant = "primary",
  icon,
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 text-white shadow-[0_18px_38px_rgba(133,42,182,0.32),0_0_18px_rgba(255,183,77,0.3)]",
    secondary:
      "bg-white/70 text-slate-900 shadow-[0_14px_32px_rgba(65,24,104,0.14)] backdrop-blur-md",
    ghost: "bg-white/15 text-white shadow-[0_12px_24px_rgba(15,23,42,0.12)] backdrop-blur-md",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-sm font-black uppercase tracking-[0.08em] ${variants[variant]} ${className}`}
      {...props}
    >
      {icon ? <span>{icon}</span> : null}
      <span>{children}</span>
    </motion.button>
  );
}
