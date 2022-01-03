/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";

interface Props {
  isPuzzleComplete: boolean;
}

const Puzzle: React.FC<Props> = ({ isPuzzleComplete, children }) => {
  const puzzleVariant = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
    },
    complete: {
      opacity: 1,
      scale: 0.8,
      y: "-10%",
      transition: {
        delay: 1,
        type: "tween",
        duration: 1,
        ease: "anticipate",
      },
    },
  };

  return (
    <motion.div
      variants={puzzleVariant}
      initial="hidden"
      animate={!isPuzzleComplete ? "show" : "complete"}
      className="absolute z-50 select-none"
    >
      <div className={`relative z-10`}>{children}</div>
    </motion.div>
  );
};

export default Puzzle;
