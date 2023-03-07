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
  draw(context: CanvasRenderingContext2D, color=`rgba(255, 255, 255, 0.15)`) {
    context.beginPath();
    context.strokeStyle = color;
    context.fillStyle = color;
    const vertices = this.vertices;
    if (vertices && vertices.length > 1) {
      context.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        context.lineTo(vertices[i].x, vertices[i].y);
      }
      context.lineTo(vertices[0].x, vertices[0].y);
    }
    context.stroke();
    context.fill();
    context.closePath();
  }
};