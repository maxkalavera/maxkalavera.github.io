import type { Coordinate, HexagonSideAngles } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class Hexagon {
  center: Coordinate
  vertices: Coordinate[]
  neighbours: Map<HexagonSideAngles, Hexagon>;
  isTarget: boolean;

  constructor(x: number, y: number, radius: number) {
    this.center = [x, y];
    this.vertices = [
      [x - radius * 0.5, y + radius],
      [x + radius * 0.5, y + radius],
      [x + radius, y],
      [x + radius * 0.5, y - radius],
      [x - radius * 0.5, y - radius],
      [x - radius, y],
    ];
    this.neighbours = new Map();
    this.isTarget = false;
  }
  setNeighbour(key: HexagonSideAngles, neighbour: Hexagon) {
    this.neighbours.set(key, neighbour);
  }
  draw(context: CanvasRenderingContext2D, color=`rgba(255, 255, 255, 0.15)`) {
    context.beginPath();
    context.strokeStyle = color;
    context.fillStyle = color;
    const vertices = this.vertices;
    if (vertices && vertices.length > 1) {
      context.moveTo(vertices[0][0], vertices[0][1]);
      for (let i = 1; i < vertices.length; i++) {
        context.lineTo(vertices[i][0], vertices[i][1]);
      }
      context.lineTo(vertices[0][0], vertices[0][1]);
    }
    context.stroke();
    context.fill();
    context.closePath();
  }
};