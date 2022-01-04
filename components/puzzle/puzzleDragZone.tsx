import { useState, useRef, useEffect } from "react";

import clsx from "clsx";
import { motion } from "framer-motion";

import { IdragUpdate, IDomRect } from "@/types/drag";
import { Ipieces } from "@/types/pieces";

import { DragZoneMarker } from "@/components/puzzle";

import styles from "@/styles/dragZone.module.css";

interface Props {
  piece: Ipieces;
  isDropZone?: boolean;
  isPuzzleComplete: boolean;
  id: string;
  width: number;
  unitSize: { unit: string; size: string };
  index: number;
  coords?: number[];
  isDisplayed: boolean;
  isHoverItsDropzone: boolean;
  handleOnDrag?: (dragUpdate: IdragUpdate) => void;
  handleDropZonesDOMRects?: (zoneBoundingArea: {
    [x: string]: IDomRect;
  }) => void;
}

const DragZone = ({
  piece,
  id,
  width,
  unitSize,
  isPuzzleComplete,
  index,
  coords,
  isDisplayed,
  isHoverItsDropzone,
  isDropZone,
  handleOnDrag,
  handleDropZonesDOMRects,
}: Props) => {
  const zoneRefWidth = Number(piece.layout.grid[0]) * Number(unitSize.size);
  const zoneRefHeight = Number(piece.layout.grid[1]) * Number(unitSize.size);
  const zoneRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const zoneRefEl = zoneRef.current;
    if (zoneRefEl && handleDropZonesDOMRects) {
      handleDropZonesDOMRects({
        [id]: {
          top: zoneRefEl.getBoundingClientRect().top + window.scrollY,
          left: zoneRefEl.getBoundingClientRect().left,
          right: zoneRefEl.getBoundingClientRect().right,
          bottom: zoneRefEl.getBoundingClientRect().bottom,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div
      ref={zoneRef}
      className={clsx(
        `absolute z-10 user-select-none`,
        { "z-50": isDragging },
        { "bg-transparent": !isDropZone }
      )}
      style={{
        top: `${!isDropZone && coords ? coords[1].toString() : "0"}%`,
        left: `${!isDropZone && coords ? coords[0].toString() : "0"}%`,
        width: `${zoneRefWidth.toString()}${unitSize.unit}`,
        height: `${zoneRefHeight.toString()}${unitSize.unit}`,
      }}
    >
      {isDisplayed && (
        <motion.div
          className={clsx(
            `z-20 grid`,
            { "relative z-[9999]": isDragging },
            { "cursor-grab": !isDropZone }
          )}
          style={{
            gridTemplateColumns: `repeat(${piece.layout.grid[0]}, 1fr)`,
            gridTemplateRows: `repeat(${piece.layout.grid[1]}, 1fr)`,
          }}
          drag={!isDropZone ? true : false}
          whileTap={{ cursor: "grabbing" }}
          layoutId={`box-${id}`}
          initial={false}
          dragTransition={{
            bounceStiffness: 300,
            bounceDamping: 25,
          }}
          dragSnapToOrigin={isHoverItsDropzone && isDragging ? false : true}
          dragElastic={1}
          onDrag={(_, info) => {
            if (!isDropZone && handleOnDrag) {
              setIsDragging(true);

              handleOnDrag({
                action: "onDrag",
                id: id,
                index: index,
                draggableCoords: { x: info.point.x, y: info.point.y },
              });
            }
          }}
          onDragEnd={(_, info) => {
            setIsDragging(false);

            if (handleOnDrag)
              handleOnDrag({
                action: "onDragEnd",
                id: id,
                index: index,
                draggableCoords: { x: info.point.x, y: info.point.y },
              });
          }}
        >
          {piece.layout.units.map((unit, i) => {
            const isEndAnimatedElement = unit.includes("endAnimation");
            return (
              <div
                key={`unit-${i}`}
                className={clsx(
                  `${unit} relative`,
                  `${
                    isEndAnimatedElement && isPuzzleComplete
                      ? styles.endAnimation
                      : ""
                  }`
                )}
                style={{
                  width: `${unitSize.size}${unitSize.unit}`,
                  height: `${unitSize.size}${unitSize.unit}`,
                }}
              >
                {/* Marker? */}
                {unit.includes("marker") && !isDropZone && (
                  <DragZoneMarker context="drag" unit={unit} />
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DragZone;
