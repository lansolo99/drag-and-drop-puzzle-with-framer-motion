/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
React.useLayoutEffect = React.useEffect;
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import type { NextPage } from "next";

import clsx from "clsx";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
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
  PuzzleCompleteBackAnimation,
} from "@/components/puzzle";

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

  const handleSetPuzzleFinished = () => {
    setPieces((prev: any) => {
      const newPieces = [...prev];
      newPieces.forEach((piece: Ipieces) => {
        piece.isPositionned = true;
      });
      return newPieces;
    });

    setIsPuzzleComplete(true);
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
            {/* Lottie complete animation */}
            {isPuzzleComplete && <PuzzleCompleteBackAnimation />}

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

        {/* Finish puzzle helper */}
        <button
          // onClick={() => setIsPuzzleComplete(true)}
          onClick={() => handleSetPuzzleFinished()}
          disabled={isPuzzleComplete}
          className={clsx(
            "absolute p-[6px] top-[5px] left-[5px] shadow rounded-sm flex items-center justify-center w-8 h-8 text-white bg-magenta-500 duration-100 transition fill-current",
            { "hover:bg-magenta-700 ": !isPuzzleComplete },
            { "opacity-50": isPuzzleComplete }
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
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
