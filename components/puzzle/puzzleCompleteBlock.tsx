import { motion } from "framer-motion";

interface Props {
  handleResetPuzzle: () => void;
}

const PuzzleCompleteBlock = ({ handleResetPuzzle }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: "250%", x: "-50%" }}
      animate={{ opacity: 1, y: "150%", x: "-50%" }}
      transition={{ delay: 2 }}
      id="completionBlock"
      className="absolute left-1/2 -translate-x-1/2 bottom-0  w-[100vw] md:w-2/3 space-y-4 flex flex-col justify-center z-40"
    >
      <p className="text-4xl text-center md:text-3xl">Well done!</p>
      <button className="mx-auto text-lg text-white duration-150 ease-out rounded shadow bg-magenta-500 hover:bg-magenta-700">
        <div
          onClick={() => handleResetPuzzle()}
          className="px-6 py-2 text-2xl w-full-h-full shadow-lt"
        >
          Restart
        </div>
      </button>
    </motion.div>
  );
};

export default PuzzleCompleteBlock;
