import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import useIsMobileViewport from "../hooks/useIsMobileViewport";
import { GAME_MODES } from "../features/game/gameLogic";
import ConfusionOverlay from "./ConfusionOverlay";
import RevealCard from "./RevealCard";

function WordRevealCard(props) {
  const isDoubleWordMode = props.mode === GAME_MODES.DOUBLE_WORD;
  const reduceMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[30rem]"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
      animate={reduceMotion || isMobileViewport ? { opacity: 1 } : { opacity: 1, scale: [0.96, 1.01, 1] }}
      transition={{ duration: reduceMotion || isMobileViewport ? 0.2 : 0.4, ease: "easeOut" }}
    >
      <ConfusionOverlay active={isDoubleWordMode} className="rounded-[2.4rem]" />
      <RevealCard {...props} />
    </motion.div>
  );
}

export default memo(WordRevealCard);
