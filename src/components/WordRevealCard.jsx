import { motion } from "framer-motion";
import { GAME_MODES } from "../features/game/gameLogic";
import ConfusionOverlay from "./ConfusionOverlay";
import RevealCard from "./RevealCard";

export default function WordRevealCard(props) {
  const isDoubleWordMode = props.mode === GAME_MODES.DOUBLE_WORD;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[30rem]"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: [0.94, 1.01, 1] }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <ConfusionOverlay active={isDoubleWordMode} className="rounded-[2.4rem]" />
      <RevealCard {...props} />
    </motion.div>
  );
}
