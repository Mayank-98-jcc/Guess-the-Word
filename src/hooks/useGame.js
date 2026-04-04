import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

export function useGame() {
  const context = useContext(GameContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return {
    ...context,
    navigate,
  };
}
