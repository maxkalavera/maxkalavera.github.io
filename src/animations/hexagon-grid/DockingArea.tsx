
import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import { calculateDistance2Points } from "src/animations/hexagon-grid/utils";

import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";
import type HexagonGridAnimation from 'src/animations/hexagon-grid/HexagonGridAnimation';

export default class DockingArea extends AreaOfInterest {
  static assignLocation(context: HexagonGridAnimation, target: Coordinate): Coordinate | undefined {
    let distanceTuple: [number, Coordinate | undefined] = [Infinity, undefined];
    context.dockingAreaHexagonsCenters.forEach((center) => {
      const distance = calculateDistance2Points(center, target);
      if (distance < distanceTuple[0]) {
        distanceTuple = [distance, center];
      }
    });
    return distanceTuple[1];
  }
  draw(context: CanvasRenderingContext2D) {
    super.draw(context, `rgba(255, 255, 0, 0.55)`);
  }
}