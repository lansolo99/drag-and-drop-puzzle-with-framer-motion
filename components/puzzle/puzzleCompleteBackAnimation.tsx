import { motion } from "framer-motion";
import Lottie from "react-lottie-player";

import lottieJson from "@/assets/animations/sparks.json";

const PuzzleCompleteBackAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] md:w-[800px] md:h-[800px]"
    >
      <motion.div className="scale-[70%] md:scale-[90%]">
        <Lottie
          play
          loop={true}
          speed={2}
          animationData={lottieJson}
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default PuzzleCompleteBackAnimation;
