/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
React.useLayoutEffect = React.useEffect;

import { GetStaticProps } from "next";
import type { NextPage } from "next";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import Lottie from "react-lottie-player";
import Div100vh from "react-div-100vh";

import { numberBetween, setMarkerColor } from "@/lib/utils";

import { Ipieces } from "@/types/pieces";
import { Islots } from "@/types/slots";
import { MessageList } from "@/types/misc";

import { IdragUpdate, Icoords, IDomRect } from "@/types/drag";

import { puzzleSlots, puzzlePieces, puzzleEndMessage } from "@/datas";

import { Puzzle, DragZone, EndMessage } from "@/components/puzzle";

import lottieJson from "@/assets/animations/sparks.json";

const checkInDropBoundaries = (
  draggableCoords: Icoords,
  dropZonesDOMRect: IDomRect
) => {
  const isDraggedXInRange = numberBetween(
    draggableCoords.x,
    dropZonesDOMRect.left,
    dropZonesDOMRect.right
  );

  const isDraggedYInRange = numberBetween(
    draggableCoords.y,
    dropZonesDOMRect.top,
    dropZonesDOMRect.bottom
  );

  return isDraggedXInRange && isDraggedYInRange;
};

interface Props {
  slots: Islots;
  piecesCollection: Ipieces[];
  endMessage: MessageList;
}

const Home: NextPage<Props> = ({ slots, piecesCollection, endMessage }) => {
  const [pieces, setPieces] = useState<Ipieces[] | null>(null);
  const [unitSize, setUnitSize] = useState({ unit: "px", size: "0" });
  const [isHoverItsDropzone, setIsHoverItsDropzone] = useState(false);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);

  useEffect(() => {
    setPieces(piecesCollection);
  }, [piecesCollection]);

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { width } = useWindowSize();

  useEffect(() => {
    setUnitSize(
      isDesktop ? { unit: "px", size: "23" } : { unit: "vw", size: "4.5" }
    );
  }, [isDesktop]);

  const [dropZonesDOMRects, setdropZonesDOMRects] = useState<any | null>(null);

  const handledropZonesDOMRects = (zoneBoundingArea: {
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
    const isInDropBoundaries = checkInDropBoundaries(
      draggableCoords,
      dropZonesDOMRects[id]
    );

    switch (action) {
      case "update":
        if (isInDropBoundaries) {
          console.log("isInDropBoundaries");
          setIsHoverItsDropzone(true);
        } else {
          console.log("NOT isInDropBoundaries");
          setIsHoverItsDropzone(false);
        }
        break;
      case "end":
        if (isInDropBoundaries) {
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

  return (
    <Div100vh className="overflow-hidden">
      <main
        className={clsx(
          "flex items-center justify-center h-full p-4 overflow-hidden relative mx-auto"
        )}
      >
        {pieces && (
          <Puzzle isPuzzleComplete={isPuzzleComplete}>
            {/* EndLottieAnimation */}
            {isPuzzleComplete && (
              <motion.div
                id="lottie"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
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

            {/* Puzzle slots */}
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
                          `relative ${unit} ${
                            unit && !unit.includes("bg-transparent")
                              ? "bg-white"
                              : ""
                          }`,
                          {
                            "before:block before:absolute before:w-[3px] before:h-[3px] before:bg-black before:opacity-[0.15]":
                              unit.includes("patch"),
                          }
                        )}
                      >
                        {/* Slot marker? */}
                        {unit.includes("marker") && (
                          <div
                            className="absolute rounded-sm shadow w-[1.15vw] md:w-[7px] md:h-[7px] h-[1.15vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{
                              backgroundColor: `${setMarkerColor(unit)}`,
                            }}
                          ></div>
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
                            isHoverItsDropzone={isHoverItsDropzone}
                            handledropZonesDOMRects={handledropZonesDOMRects}
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
            {/* {pieces.map((piece, i) => {
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
                  isHoverItsDropzone={isHoverItsDropzone}
                  handleOnDrag={handleOnDrag}
                />
              );
            })} */}
            <div className="absolute bottom-[-30%] -translate-x-1/2 left-1/2 w-2/3 space-y-4 flex flex-col justify-center">
              <p className="text-3xl text-center ">Well done!</p>

              <button className="mx-auto text-lg text-white duration-150 ease-out rounded shadow  bg-magenta-500 hover:bg-magenta-700">
                <div className="px-6 py-2 w-full-h-full shadow-lt">Restart</div>
              </button>
            </div>
          </Puzzle>
        )}

        {/* EndMessage */}

        {isPuzzleComplete && (
          <div id="endMessage" className="relative top-[-10%]">
            <EndMessage textDatas={endMessage} />
          </div>
        )}
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
      endMessage: puzzleEndMessage,
    },
  };
};
