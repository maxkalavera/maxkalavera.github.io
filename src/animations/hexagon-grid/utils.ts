import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";

export function calculateDistance2Points(pointA: Coordinate, pointB: Coordinate) {
  return Math.sqrt(Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2));
};

export function calculateDistanceSegment(valueA: number, valueB: number) {
  return Math.abs(valueB - valueA)
};