/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
React.useLayoutEffect = React.useEffect;
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import type { NextPage } from "next";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import Lottie from "react-lottie-player";
import Div100vh from "react-div-100vh";

import { isCoordsInDropBoundaries } from "@/lib/utils";

import { Ipieces } from "@/types/pieces";
import { Islots } from "@/types/slots";

import { IdragUpdate, IDomRect } from "@/types/drag";

import { puzzleSlots, puzzlePieces } from "@/datas";

import {
  Puzzle,
  DragZone,
  DragZoneMarker,
  PuzzleCompleteBlock,
} from "@/components/puzzle";

import lottieJson from "@/assets/animations/sparks.json";

interface Props {
  slots: Islots;
  piecesCollection: Ipieces[];
}

const Home: NextPage<Props> = ({ slots, piecesCollection }) => {
  const [pieces, setPieces] = useState<Ipieces[] | null>(null);
  const [unitSize, setUnitSize] = useState({ unit: "px", size: "0" });
  const [dropZonesDOMRects, setdropZonesDOMRects] = useState<any | null>(null);
  const [isHoverItsDropzone, setIsHoverItsDropzone] = useState(false);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);

  const router = useRouter();

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { width } = useWindowSize();

  useEffect(() => {
    setUnitSize(
      isDesktop ? { unit: "px", size: "23" } : { unit: "vw", size: "4.5" }
    );
  }, [isDesktop]);

  useEffect(() => {
    setPieces(piecesCollection);
  }, [piecesCollection]);

  useEffect(() => {
    if (pieces) {
      const isAllPiecesPositionned = pieces.every(
        (piece: Ipieces) => piece.isPositionned === true
      );

      if (isAllPiecesPositionned) {
        setIsPuzzleComplete(true);
      }
    }
  }, [pieces]);

  const handleDropZonesDOMRects = (zoneBoundingArea: {
    [key: string]: IDomRect;
  }) => {
    setdropZonesDOMRects((prev: any) => ({ ...prev, ...zoneBoundingArea }));
  };

  const handleOnDrag = ({
    action,
    id,
    index,
    draggableCoords,
  }: IdragUpdate) => {
    const isInDropzoneBoundaries = isCoordsInDropBoundaries(
      draggableCoords,
      dropZonesDOMRects[id]
    );

    switch (action) {
      case "onDrag":
        if (isInDropzoneBoundaries) {
          setIsHoverItsDropzone(true);
        } else {
          setIsHoverItsDropzone(false);
        }
        break;
      case "onDragEnd":
        if (isInDropzoneBoundaries) {
          setIsHoverItsDropzone(false);
          setPieces((prev: any) => {
            const newPieces = [...prev];
            newPieces[index].isPositionned = true;
            return newPieces;
          });
        }
        break;
    }
  };

  const handleResetPuzzle = () => {
    router.reload();
  };

  return (
    <Div100vh className="overflow-hidden">
      <main
        className={clsx(
          "flex items-center justify-center h-full p-4 overflow-hidden relative mx-auto"
        )}
      >
        {pieces && (
          <Puzzle isPuzzleComplete={isPuzzleComplete}>
            {isPuzzleComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] md:w-[800px] md:h-[800px]"
              >
                <Lottie
                  play
                  loop={true}
                  speed={2}
                  animationData={lottieJson}
                  style={{ width: "100%", height: "100%" }}
                />
              </motion.div>
            )}

            {/* Slots */}
            {slots.layout.rows.map((row, i) => {
              return (
                <div key={`row-${i}`} className="relative flex ">
                  {row.units.map((unit, i) => {
                    const endzoneRef = unit.match(/endzone-\w/);
                    const endZoneRefDataId = endzoneRef?.[0].split("-")[1];
                    const pieceItemData = pieces.find(
                      (piece) => piece.id === endZoneRefDataId
                    );

                    return (
                      <div
                        key={`slotUnit-${i}`}
                        style={{
                          width: `${unitSize.size}${unitSize.unit}`,
                          height: `${unitSize.size}${unitSize.unit}`,
                        }}
                        className={clsx(
                          `relative ${unit} `,
                          {
                            "bg-white":
                              unit && !unit.includes("bg-transparent"),
                          },
                          {
                            "before:block before:absolute before:w-[3px] before:h-[3px] before:bg-black before:opacity-[0.15]":
                              unit.includes("patch"),
                          }
                        )}
                      >
                        {/* Marker? */}
                        {unit.includes("marker") && (
                          <DragZoneMarker context="drop" unit={unit} />
                        )}

                        {/* Positionned dragzone? */}
                        {endzoneRef && pieceItemData && (
                          <DragZone
                            key={`end-${i}`}
                            index={i}
                            unitSize={unitSize}
                            isDropZone
                            isPuzzleComplete={isPuzzleComplete}
                            id={pieceItemData?.id}
                            width={width}
                            isDisplayed={pieceItemData.isPositionned === true}
                            // isDisplayed={isPuzzleComplete}
                            isHoverItsDropzone={isHoverItsDropzone}
                            handleDropZonesDOMRects={handleDropZonesDOMRects}
                            piece={pieceItemData as Ipieces}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Floating pieces */}
            {pieces.map((piece, i) => {
              return (
                <DragZone
                  key={`start-${i}`}
                  index={i}
                  width={width}
                  unitSize={unitSize}
                  isDropZone={false}
                  piece={piece}
                  isPuzzleComplete={isPuzzleComplete}
                  id={piece.id}
                  coords={piece.coords}
                  isDisplayed={piece.isPositionned === false}
                  // isDisplayed={!isPuzzleComplete}
                  isHoverItsDropzone={isHoverItsDropzone}
                  handleOnDrag={handleOnDrag}
                />
              );
            })}

            {/* Completion block */}
            {isPuzzleComplete && (
              <PuzzleCompleteBlock handleResetPuzzle={handleResetPuzzle} />
            )}
          </Puzzle>
        )}

        {/* Helper */}
        <button
          onClick={() => setIsPuzzleComplete(true)}
          className="absolute top-0 left-0 w-10 h-10 bg-red-500"
        ></button>
      </main>
    </Div100vh>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      piecesCollection: puzzlePieces,
      slots: puzzleSlots,
    },
  };
};
