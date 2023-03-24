//import Hexagon from "src/animations/hexagon-grid/Hexagon";

import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";
import type HexagonGridAnimation from 'src/animations/hexagon-grid/HexagonGridAnimation';

export default class AreaOfInterest {
  context: HexagonGridAnimation;
  className: string;
  element: Element;
  rect: DOMRect;
  hexagonsCenters: Coordinate[] = [];
  //static locations: Set<Coordinate> = new Set();
  constructor(
    context: HexagonGridAnimation,
    className: string,
    element: Element,
    rect: DOMRect, 
    hexagonsCenters: Coordinate[],
  ) {
    this.context = context;
    this.className = className;
    this.element = element;
    this.rect = rect;
    this.hexagonsCenters = hexagonsCenters;
  }
  draw(context: CanvasRenderingContext2D, color=`rgba(255, 255, 255, 0.15)`) {
    this.hexagonsCenters.forEach((center) => this.context.grid.drawHexagon(context, center, color));
    //this.hexagons.forEach((hexagon) => hexagon.draw(context, hexagonColor));
  }
  update() {
    this.rect = this.element.getBoundingClientRect();
    //this.hexagons = this.context.grid.locateHexagonsByDOMRect(this.rect);
  }
};