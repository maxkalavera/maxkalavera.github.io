import cloneDeep from 'lodash/cloneDeep';
import DockingArea from "src/animations/hexagon-grid/DockingArea";
import TargetArea from "src/animations/hexagon-grid/TargetArea";
import {calculateDistance2Points} from "src/animations/hexagon-grid/utils";

import type HexagonGridAnimation from 'src/animations/hexagon-grid/HexagonGridAnimation';
import type { GridInfo, Coordinate, RectAreaBounds } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class HexagonGrid {
  context: HexagonGridAnimation;
  info: GridInfo = {
    canvas: {width: 0, height: 0},
    size: {width: 0, height: 0},
    cell: {size: {radius: 0, diameter: 0}}
  };
  constructor(context: HexagonGridAnimation, hexagonRadius=12) {
    this.context = context;
    this.info = this.setGridSize(
      {
        ...this.info,
        cell: {size: {radius: hexagonRadius, diameter: hexagonRadius * 2}},
      }, 
      this.context.canvas
    );
  }
  setGridSize(info: GridInfo, canvas: HTMLCanvasElement) {
    info.canvas.width = canvas.width;
    info.canvas.height = canvas.height;
    info.size.width = Math.ceil(info.canvas.width / (info.cell.size.diameter * 0.75));
    info.size.height = Math.ceil(info.canvas.height / info.cell.size.radius);
    return info;
  }
  update(canvas: HTMLCanvasElement) {
    this.info = this.setGridSize(this.info, canvas);
  }
  calculateHexagonCenters(
    info: GridInfo, 
    offsetVector: [number, number] = [0, 0],
    bounds: RectAreaBounds = {horizontal: [0, info.size.width], vertical: [0, info.size.height]}
  ): Coordinate[] {
    const values: Coordinate[] = [];
    const unitVector = [info.cell.size.diameter * 0.75, info.cell.size.radius];
    for (let x = bounds.horizontal[0]; x <= bounds.horizontal[1]; x++) {
      for (let y = bounds.vertical[0]; y <= bounds.vertical[1]; y++) {
        if (((x % 2) && (y % 2)) || !((x % 2) || (y % 2))) {
          values.push([
            x * unitVector[0],
            y * unitVector[1]
          ]);
        }
      }
    }
    return values;
  }
  calculateSingleHexagonVertices(center: Coordinate): Coordinate[] {
    const radius = this.info.cell.size.radius;
    const [x, y] = center;
    return [
      [x - radius * 0.5, y + radius],
      [x + radius * 0.5, y + radius],
      [x + radius, y],
      [x + radius * 0.5, y - radius],
      [x - radius * 0.5, y - radius],
      [x - radius, y],
    ];
  }
  findOverlapingHexagon(position: Coordinate): Coordinate | undefined {
    const xRatio = Math.round(position[0] / (this.info.cell.size.radius * 1.5));
    const x = xRatio * (this.info.cell.size.radius * 1.5);
    let y = position[1];
    if (xRatio % 2) {
      y = this.info.cell.size.radius + (Math.round((position[1] - this.info.cell.size.radius) / (this.info.cell.size.radius * 2.0)) * this.info.cell.size.radius * 2.0);
    } else {
      y = Math.round(position[1] / (this.info.cell.size.radius * 2.0)) * this.info.cell.size.radius * 2.0;
    }
    return [
      x, 
      y
    ];
  }
  drawHexagon(context: CanvasRenderingContext2D, center: Coordinate, color=`rgba(255, 255, 255, 0.15)`) {
    const vertices = this.calculateSingleHexagonVertices(center);
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(...vertices[vertices.length - 1]);
    vertices.forEach((vertex) => {
      context.lineTo(...vertex);
    });   
    context.closePath();
    context.fill();
  }
  draw(context: CanvasRenderingContext2D, color=`rgba(255, 255, 255, 0.15)`) {
    const hexagonCenters = this.calculateHexagonCenters(this.info, [-window.scrollX, -window.scrollY]);
    hexagonCenters.forEach((center) => {
      const vertices = this.calculateSingleHexagonVertices(center);
      context.lineWidth = 1;
      context.strokeStyle = color;

      context.beginPath();
      context.moveTo(vertices[0][0], vertices[0][1]);
      context.lineTo(vertices[1][0], vertices[1][1]);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.moveTo(vertices[1][0], vertices[1][1]);
      context.lineTo(vertices[2][0], vertices[2][1]);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.moveTo(vertices[2][0], vertices[2][1]);
      context.lineTo(vertices[3][0], vertices[3][1]);
      context.stroke();
      context.closePath();
    });
  }
  getHTMLElements(className: string) {
    return Array.from(document.getElementsByClassName(className));
  }
  locateHexagonsCentersByDOMRect(rect: DOMRect): Coordinate[] {
    const unitVector = [this.info.cell.size.diameter * 0.75, this.info.cell.size.radius];
    const bounds = {
      horizontal: [
        Math.round(rect.left / unitVector[0]), 
        Math.round(rect.right / unitVector[0])
      ],
      vertical: [
        Math.round(rect.top / unitVector[1]), 
        Math.round(rect.bottom / unitVector[1])
      ]
    } as RectAreaBounds;
    return this.calculateHexagonCenters(this.info, [0, 0], bounds);

    /*
    let indexRect = {
      x: [
        Math.floor(rect.left / (this.info.cell.size.diameter * 0.75)),
        Math.ceil(rect.right / (this.info.cell.size.diameter * 0.75))
      ] as [number, number],
      y: [
        Math.floor(rect.top / this.info.cell.size.radius),
        Math.ceil(rect.bottom / this.info.cell.size.radius)
      ] as [number, number]
    };
    indexRect = {
      x: [
        indexRect.x[0] < 0 ? 0 : indexRect.x[0],
        indexRect.x[1] < 0 ? 0 : indexRect.x[1],
      ],
      y: [
        indexRect.y[0] < 0 ? 0 : indexRect.y[0], 
        indexRect.y[1] < 0 ? 0 : indexRect.y[1],
      ]
    };

    const matrix = this.matrix
      .slice(indexRect.x[0], indexRect.x[1])
      .map((column) => column.slice(indexRect.y[0], indexRect.y[1]));

    const hexagons: Hexagon[] = matrix
      .map((column) => column.filter((hexagon) => hexagon))
      .reduce((accumulator, column) => accumulator.concat(column), []);

    return hexagons;
    */
   return [];
  }
  getDockingAreasByClassName(className: string) {
    const elements = this.getHTMLElements(className);
    const dockingAreas = elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const hexagonsCenters = this.locateHexagonsCentersByDOMRect(rect);
      return new DockingArea(this.context, className, element, rect, hexagonsCenters);
    });
    return dockingAreas;
  }
  getTargetAreasByClassName(className: string) {
    const elements = this.getHTMLElements(className);
    const targetAreas = elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const hexagonsCenters = this.locateHexagonsCentersByDOMRect(rect);
      return new TargetArea(this.context, className, element, rect, hexagonsCenters);
    });
    return targetAreas;
  }
}
