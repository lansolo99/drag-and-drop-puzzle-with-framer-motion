import { MessageList } from "@/types/misc";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import clsx from "clsx";

interface Props {
  textDatas: MessageList;
}

const wordsWrapperVariant = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 2.2,
      staggerChildren: 0.3,
    },
  },
};

const slidingUpWordVariant = {
  hidden: {
    y: 100,
  },
  show: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      velocity: 3,
    },
  },
  hide: {
    y: 100,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      velocity: 3,
    },
  },
};

const EndMessage = ({ textDatas }: Props) => {
  useEffect(() => {
    setTimeout(() => {
      const lastItem = {
        title: "Bonne journée !",
        color: "text-anthracite-500",
        size: "normal",
      };
    }, 5000);
  }, []);

  return (
    <motion.div
      layout
      variants={wordsWrapperVariant}
      initial="hidden"
      animate="show"
      onAnimationComplete={(definition) => {
        console.log(definition);
      }}
    >
      {textDatas?.map((item, i) => {
        return (
          <div key={i} className="relative overflow-hidden">
            <motion.p
              layout
              variants={slidingUpWordVariant}
              className={clsx(
                `${item.color} tracking-wide relative`,
                {
                  "text-[8.5vw] 420+:text-[40px] leading-[125%]":
                    item.size === "normal",
                },
                {
                  "text-[21vw] 420+:text-[95px] leading-[115%]":
                    item.size === "big",
                },
                {
                  "text-[6vw] 420+:text-[35px] leading-[100%]":
                    item.size === "small",
                }
              )}
            >
              {item.title}
            </motion.p>
          </div>
        );
      })}
    </motion.div>
  );
};

export default EndMessage;
