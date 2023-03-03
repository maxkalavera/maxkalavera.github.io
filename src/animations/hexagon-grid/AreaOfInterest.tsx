import Hexagon from "src/animations/hexagon-grid/Hexagon";

import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";

export default class AreaOfInterest {
  className: string;
  grid: HexagonGrid;
  elements: Set<Element>;
  hexagons: Set<Hexagon>;
  targets: Set<Hexagon> = new Set();
  constructor(grid: HexagonGrid, className: string) {
    this.grid = grid;
    this.className = className;
    this.elements = new Set();
    this.hexagons = new Set();
  }
  update() {
    this.getHTMLElements();
    this.assignHexagons();
  }
  getHTMLElements() {
    this.elements = new Set(document.getElementsByClassName(this.className));
  }
  assignHexagons() {
    this.elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      // Get the hexagons inside the bounding area
      const hexagons = Array.from(this.grid.coordinatesDict.entries())
        .filter(([x, ySet]) => x >= rect.left && x <= rect.right)
        .map(([x, ySet]) => 
        Array.from(ySet.values())
          .filter((y) => y >= rect.top && y <= rect.bottom)
          .map((y) => ({x, y}))
        )
        .reduce((accumulator, variations) => accumulator.concat(variations), [])
        .map((item) => this.grid.hexagons.get(JSON.stringify(item)))
        .filter((hexagon) => hexagon) as Hexagon[];
      // Add the hexagons to the properties Set
      hexagons.forEach((hexagon) => this.hexagons.add(hexagon));
    });
  }
};