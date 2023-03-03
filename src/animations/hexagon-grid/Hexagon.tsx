import type { Coordinate, HexagonSideAngles } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class Hexagon {
  center: Coordinate
  vertices: Coordinate[]
  neighbours: Map<HexagonSideAngles, Hexagon>;
  isTarget: boolean;

  constructor(x: number, y: number, radius: number) {
    this.center = {x, y};
    this.vertices = [
      {x: x - radius * 0.5, y: y + radius},
      {x: x + radius * 0.5, y: y + radius},
      {x: x + radius, y: y},
      {x: x + radius * 0.5, y: y - radius},
      {x: x - radius * 0.5, y: y - radius},
      {x: x - radius, y: y},
    ];
    this.neighbours = new Map();
    this.isTarget = false;
  }
  setNeighbour(key: HexagonSideAngles, neighbour: Hexagon) {
    this.neighbours.set(key, neighbour);
  }
};