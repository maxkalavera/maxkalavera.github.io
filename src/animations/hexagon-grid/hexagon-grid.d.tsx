import type Hexagon from "src/animations/hexagon-grid/Hexagon";

export type Coordinate = readonly [number, number]; // [x, y]

export type ParticleBehavior = 'static';

export type HexagonSideAngles = 30 | 90 | 150 | 210 | 270 | 330;

export interface GridInfo {
  canvas: {width: number, height: number},
  size: {width: number, height: number}
  cell: {size: {radius: number, diameter: number}}
};

export interface AreaOfInterest {
  indexRect: {x: [number, number], y: [number, number]}
  hexagons: Hexagon[],
}
