import Hexagon from "src/animations/hexagon-grid/Hexagon";

import type HexagonGridAnimation from 'src/animations/hexagon-grid/HexagonGridAnimation';

export default class AreaOfInterest {
  //grid: HexagonGrid;
  context: HexagonGridAnimation;
  className: string;
  element: Element;
  rect: DOMRect;
  hexagons: Hexagon[]
  static locations: Set<Hexagon> = new Set();
  constructor(
    //grid: HexagonGrid,
    context: HexagonGridAnimation,
    className: string,
    element: Element,
    rect: DOMRect, 
    hexagons: Hexagon[]
  ) {
    this.context = context;
    this.className = className;
    this.element = element;
    this.rect = rect;
    this.hexagons = hexagons;
  }
  draw(context: CanvasRenderingContext2D, hexagonColor=`rgba(255, 255, 255, 0.15)`) {
    this.hexagons.forEach((hexagon) => hexagon.draw(context, hexagonColor));
  }
  update() {
    this.rect = this.element.getBoundingClientRect();
    this.hexagons = this.context.grid.locateHexagonsByDOMRect(this.rect);
  }
};