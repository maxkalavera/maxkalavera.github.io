
import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import { calculateDistance2Points } from "src/animations/hexagon-grid/utils";

import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";
import type HexagonGridAnimation from 'src/animations/hexagon-grid/HexagonGridAnimation';
import type Hexagon from "src/animations/hexagon-grid/Hexagon";

export default class DockingArea extends AreaOfInterest {
  static assignLocation(context: HexagonGridAnimation, target: Coordinate): Hexagon | undefined {
    let distanceTuple: [number, Hexagon | undefined] = [Infinity, undefined];
    context.dockingAreaLocations.forEach((hexagon) => {
      const distance = calculateDistance2Points(hexagon.center, target);
      if (distance < distanceTuple[0]) {
        distanceTuple = [distance, hexagon];
      }
    });
    return distanceTuple[1];
  }
  draw(context: CanvasRenderingContext2D) {
    super.draw(context, `rgba(255, 255, 0, 0.55)`);
  }
}