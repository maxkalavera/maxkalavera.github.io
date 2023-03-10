import Hexagon from "src/animations/hexagon-grid/Hexagon";

import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";

export default class AreaOfInterest {
  grid: HexagonGrid;
  className: string;
  element: Element;
  rect: DOMRect;
  hexagons: Hexagon[]
  static locations: Set<Hexagon> = new Set();
  constructor(
    grid: HexagonGrid, 
    className: string,
    element: Element,
    rect: DOMRect, 
    hexagons: Hexagon[]
  ) {
    this.grid = grid;
    this.className = className;
    this.element = element;
    this.rect = rect;
    this.hexagons = hexagons;
  }
  draw(context: CanvasRenderingContext2D, hexagonColor=`rgba(255, 255, 255, 0.15)`) {
    this.hexagons.forEach((hexagon) => hexagon.draw(context, hexagonColor));
  }
};