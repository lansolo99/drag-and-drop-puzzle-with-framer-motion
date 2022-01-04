import clsx from "clsx";
import { setMarkerColor } from "@/lib/utils";

interface Props {
  context: "drag" | "drop";
  unit: string;
}

const PuzzleDragzoneMarker = ({ context, unit }: Props) => {
  return (
    <div
      className={clsx(
        "absolute w-[1.2vw] h-[1.2vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm",
        { " md:w-[6px] md:h-[6px]": context === "drag" },
        { "md:w-[7px] md:h-[7px]": context === "drop" }
      )}
      style={{
        backgroundColor: `${setMarkerColor(unit)}`,
      }}
    >
      <div
        className="relative w-full h-full rounded-sm shadow"
        style={{ backgroundColor: `${setMarkerColor(unit)}` }}
      ></div>
    </div>
  );
};

export default PuzzleDragzoneMarker;
