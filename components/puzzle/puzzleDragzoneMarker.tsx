import { setMarkerColor } from "@/lib/utils";

interface Props {
  unit: string;
}

const PuzzleDragzoneMarker = ({ unit }: Props) => {
  return (
    <div
      className="absolute rounded-sm shadow w-[1.15vw] md:w-[7px] md:h-[7px] h-[1.15vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        backgroundColor: `${setMarkerColor(unit)}`,
      }}
    ></div>
  );
};

export default PuzzleDragzoneMarker;
