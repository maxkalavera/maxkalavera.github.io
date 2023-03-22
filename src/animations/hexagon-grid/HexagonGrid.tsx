import cloneDeep from 'lodash/cloneDeep';
import Hexagon from "src/animations/hexagon-grid/Hexagon";
import DockingArea from "src/animations/hexagon-grid/DockingArea";
import TargetArea from "src/animations/hexagon-grid/TargetArea";
import {calculateDistance2Points} from "src/animations/hexagon-grid/utils";

import type HexagonGridAnimation from 'src/animations/hexagon-grid/HexagonGridAnimation';
import type { GridInfo, Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class HexagonGrid {
  context: HexagonGridAnimation;
  info: GridInfo = {
    canvas: {width: 0, height: 0},
    size: {width: 0, height: 0},
    cell: {size: {radius: 0, diameter: 0}}
  };
  hexagons: Hexagon[] = [];
  matrix: Hexagon[][] = [];
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
    info.size.width = Math.ceil(info.canvas.width / (info.cell.size.diameter * 0.75)) + 1;
    info.size.height = Math.ceil(info.canvas.height / info.cell.size.radius);
    return info;
  }
  update(canvas: HTMLCanvasElement) {
    const info = cloneDeep(this.info);
    this.setGridSize(info, canvas);
    if (JSON.stringify(info) !== JSON.stringify(this.info)) {
      [this.hexagons, this.matrix] = this.calculateHexagons(info);
      this.info = info;
    }
  }
  calculateHexagons(info: GridInfo): [Hexagon[], Hexagon[][]] {
    const hexagons = new Array<Hexagon>();
    const matrix = new Array(info.size.width).fill(null).map(() => new Array<Hexagon>(info.size.height));
    for (let x = 0; x < info.size.width; x++) {
      for (let y = 0; y < info.size.height + 1; y++) {
        if (((x % 2) && (y % 2)) || !((x % 2) || (y % 2))) {
          const hexagon = new Hexagon(x * info.cell.size.diameter * 0.75, y * info.cell.size.radius, info.cell.size.radius);
          hexagons.push(hexagon);
          matrix[x][y] = hexagon;
        }
      }
    }
    return [hexagons, matrix];
  }
  findOverlapingHexagon(position: Coordinate): Hexagon | undefined {
    let [i, j] = [
      Math.floor(position[0] / (this.info.cell.size.diameter * 0.75)),
      Math.floor(position[1] / this.info.cell.size.radius)
    ];
    return [
      [i+1, j-1], [i, j-1], [i-1, j-1], [i+1, j], [i, j], [i-1, j], [i+1, j+1], [i, j+1], [i-1, j+1],
    ].map(([x, y]) => {
        try {
          return this.matrix[x][y];
        } catch { 
          return undefined; 
        }
      })
      .filter((hexagon) => hexagon)
      .find((hexagon) => calculateDistance2Points(position, hexagon!.center) <= this.info.cell.size.radius)
  }
  draw(context: CanvasRenderingContext2D) {
    this.hexagons.forEach((hexagon) => hexagon.draw(context));
  }
  getHTMLElements(className: string) {
    return Array.from(document.getElementsByClassName(className));
  }
  locateHexagonsByDOMRect(rect: DOMRect) {
    const indexRect = {
      x: [
        Math.floor(rect.left / (this.info.cell.size.diameter * 0.75)),
        Math.ceil(rect.right / (this.info.cell.size.diameter * 0.75))
      ] as [number, number],
      y: [
        Math.floor(rect.top / this.info.cell.size.radius),
        Math.ceil(rect.bottom / this.info.cell.size.radius)
      ] as [number, number]
    };

    const matrix = this.matrix
      .slice(indexRect.x[0], indexRect.x[1])
      .map((column) => column.slice(indexRect.y[0], indexRect.y[1]));

    const hexagons: Hexagon[] = matrix
      .map((column) => column.filter((hexagon) => hexagon))
      .reduce((accumulator, column) => accumulator.concat(column), []);

    return hexagons;
  }
  getDockingAreasByClassName(className: string) {
    const elements = this.getHTMLElements(className);
    const dockingAreas = elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const hexagons = this.locateHexagonsByDOMRect(rect);
      return new DockingArea(this.context, className, element, rect, hexagons);
    });
    return dockingAreas;
  }
  getTargetAreasByClassName(className: string) {
    const elements = this.getHTMLElements(className);
    const targetAreas = elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const hexagons = this.locateHexagonsByDOMRect(rect);
      return new TargetArea(this.context, className, element, rect, hexagons);
    });
    return targetAreas;
  }
}
