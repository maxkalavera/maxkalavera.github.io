import Hexagon from "src/animations/hexagon-grid/Hexagon";
import HexagonParticle from "src/animations/hexagon-grid/HexagonParticle";
import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";

export default class AreaOfInterest {
  classNames: Set<string>;
  grid: HexagonGrid;
  elements: Set<Element>;
  constructor(grid: HexagonGrid, classNames: string[] = []) {
    this.grid = grid;
    this.classNames = new Set(classNames);
    this.elements = new Set();
  }
  addClassName(className: string) {
    this.classNames.add(className);
  }
  update() {
  }
  getHTMLElements() {
    const elements = Array.from(this.classNames)
      .map((className) => document.getElementsByClassName(className))
      .reduce<Element[]>((accumulator, items) => accumulator.concat(Array.from(items)), []);
    this.elements = new Set(elements);
    return this.elements;
  }
  locateHexagonsInElement(element: Element) {
    /*
    const rect = element.getBoundingClientRect();
    return Array.from(this.grid.coordinatesDict.entries())
    .filter(([x, ySet]) => x >= rect.left && x <= rect.right)
    .map(([x, ySet]) => 
      Array.from(ySet.values())
        .filter((y) => y >= rect.top && y <= rect.bottom)
        .map((y) => ({x, y}))
    )
    .reduce((accumulator, variations) => accumulator.concat(variations), [])
    .map((item) => this.grid.hexagons.get(JSON.stringify(item)))
    .filter((hexagon) => hexagon) as Hexagon[];
    */
  }
  locateHexagonsInArea() {
    /*
    const hexagons: Hexagon[] = [];
    this.elements.forEach((element) =>
      this.locateHexagonsInElement(element)
        .forEach((hexagon) => hexagons.push(hexagon)));
    return hexagons;
    */
  }
  delete() {

  }
};