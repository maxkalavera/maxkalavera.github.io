export interface Coordinate {
  x: number,
  y: number
}

export type ParticleBehavior = 'static';

export type HexagonSideAngles = 30 | 90 | 150 | 210 | 270 | 330;


export interface GridInfo {
  canvas: {width: number, height: number},
  size: {width: number, height: number}
  cell: {size: {radius: number, diameter: number}}
};