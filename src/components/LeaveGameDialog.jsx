import { motion } from "framer-motion";
import AppLogo from "./AppLogo";
import Button from "./Button";
import Modal from "./Modal";

export default function LeaveGameDialog({ isOpen, onStay, onLeave }) {
  return (
    <Modal
      isOpen={isOpen}
      title="Leave Game?"
      compactMobile
      footer={(
        <>
          <Button
            type="button"
            onClick={onStay}
            className="min-w-[7.5rem] bg-white/85 text-[#6f4f92] shadow-[0_10px_24px_rgba(125,88,155,0.12)]"
          >
            No
          </Button>
          <Button
            type="button"
            onClick={onLeave}
            className="min-w-[7.5rem]"
          >
            Leave
          </Button>
        </>
      )}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.82, rotate: -6, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <AppLogo
            className="mx-auto w-[5.5rem]"
            imageClassName="block w-full rounded-[1.25rem] shadow-[0_16px_34px_rgba(205,121,203,0.26)]"
          />
        </motion.div>
        <motion.p
          className="mt-4 text-base font-semibold text-[#5a416f]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.22 }}
        >
          Do you want to leave this game?
        </motion.p>
        <motion.p
          className="mt-2 text-sm font-medium text-[#86679b]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.22 }}
        >
          Your current round will close and you will go back to setup.
        </motion.p>
      </div>
    </Modal>
  );
}
