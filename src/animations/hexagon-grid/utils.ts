import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";

export function approximateDegreesAngle(
  degreesAngle: number, 
  openingRange: number=10 // from 1 to 30
) {
  if (degreesAngle >= (30 - openingRange) && degreesAngle <= (30 + openingRange)) {
    return 30;
  } else if (degreesAngle >= (90 - openingRange) && degreesAngle <= (90 + openingRange)) {
    return 90;
  } else if (degreesAngle >= (150 - openingRange) && degreesAngle <= (150 + openingRange)) {
    return 150;
  } else if (degreesAngle >= (210 - openingRange) && degreesAngle <= (210 + openingRange)) {
    return 210;
  } else if (degreesAngle >= (270 - openingRange) && degreesAngle <= (270 + openingRange)) {
    return 270;
  } else if (degreesAngle >= (330 - openingRange) && degreesAngle <= (330 + openingRange)) {
    return 330;
  } else {
    return null;
  }
};

export function distance2Points(pointA: Coordinate, pointB: Coordinate) {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

export function calculateAngle2Points(pointA: Coordinate, pointB: Coordinate) {
  const angle = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  const degreesAngle = (angle >= 0 ? angle : -1 * angle + Math.PI) * (180 / Math.PI);
  return approximateDegreesAngle(degreesAngle, 30);
};