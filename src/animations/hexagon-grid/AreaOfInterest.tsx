import Hexagon from "src/animations/hexagon-grid/Hexagon";

import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";
import type { IndexRect } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class AreaOfInterest {
  grid: HexagonGrid;
  className: string;
  element: Element;
  indexRect: IndexRect
  hexagons: Hexagon[]
  static locations: Set<Hexagon> = new Set();
  constructor(
    grid: HexagonGrid, 
    className: string,
    element: Element,
    indexRect: IndexRect, 
    hexagons: Hexagon[]
  ) {
    this.grid = grid;
    this.className = className;
    this.element = element;
    this.indexRect = indexRect;
    this.hexagons = hexagons;
  }
  draw(context: CanvasRenderingContext2D, hexagonColor=`rgba(255, 255, 255, 0.15)`) {
    this.hexagons.forEach((hexagon) => hexagon.draw(context, hexagonColor));
  }
};