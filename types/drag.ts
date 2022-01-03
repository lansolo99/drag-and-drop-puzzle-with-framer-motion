export interface Icoords {
  x: number;
  y: number;
}

export interface IdragUpdate {
  action: "update" | "end";
  index: number;
  id: string;
  draggableCoords: Icoords;
}

export interface IisHoverItsDropzone {
  id: string | null;
  status: boolean;
}

export interface IDomRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
