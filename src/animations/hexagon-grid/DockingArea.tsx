
import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import { calculateDistance2Points } from "src/animations/hexagon-grid/utils";

import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";
import type Target from "src/animations/hexagon-grid/Target";
import type Hexagon from "src/animations/hexagon-grid/Hexagon";

export default class DockingArea extends AreaOfInterest {
  static globalDockingAreas: DockingArea[] = [];
  static globalLocations: Set<Hexagon> = new Set();
  static assignLocation(target: Target): Hexagon | undefined {
    let distanceTuple: [number, Hexagon | undefined] = [Infinity, undefined];
    DockingArea.globalLocations.forEach((hexagon) => {
      const distance = calculateDistance2Points(hexagon.center, target.location.center);
      if (distance < distanceTuple[0]) {
        distanceTuple = [distance, hexagon];
      }
    });

    return distanceTuple[1];
  }
  constructor(
    grid: HexagonGrid, 
    className: string,
    element: Element,
    rect: DOMRect, 
    hexagons: Hexagon[]
  ) {
    super(grid, className, element, rect, hexagons);
    DockingArea.globalDockingAreas.push(this);
    hexagons.forEach((hexagon) => DockingArea.globalLocations.add(hexagon));
  }
  draw(context: CanvasRenderingContext2D) {
    super.draw(context, `rgba(255, 255, 0, 0.55)`);
  }
}