import cloneDeep from 'lodash/cloneDeep';
import Hexagon from "src/animations/hexagon-grid/Hexagon";
//import HexagonParticle from "src/animations/hexagon-grid/HexagonParticle";
//import DockingArea from "src/animations/hexagon-grid/DockingArea";
//import TargetArea from "src/animations/hexagon-grid/TargetArea";
//import throttle from "src/utils/throttle";
//import {calculateDistance2Points, calculateDistanceSegment, calculateAngle2Points} from "src/animations/hexagon-grid/utils";
import {calculateDistance2Points} from "src/animations/hexagon-grid/utils";

import type { GridInfo, Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class HexagonGrid {
  //mousePosition: Coordinate = {x: 0, y: 0}
  info: GridInfo = {
    canvas: {width: 0, height: 0},
    size: {width: 0, height: 0},
    cell: {size: {radius: 0, diameter: 0}}
  };
  hexagons: Hexagon[] = [];
  matrix: Hexagon[][] = [];
  constructor(canvas: HTMLCanvasElement, hexagonRadius=12) {
    this.info = this.setGridSize({
      ...this.info,
      cell: {size: {radius: hexagonRadius, diameter: hexagonRadius * 2}},
    }, canvas);
  }
  //coordinatesDict: Map<number, Set<number>> = new Map();
  //hexagons: Map<string, Hexagon> = new Map();
  //cursorParticle: HexagonParticle;
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
      Math.floor(position.x / (this.info.cell.size.diameter * 0.75)),
      Math.floor(position.y / this.info.cell.size.radius)
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
  /*
  generateHexagons() {
    const hexagons: Map<string, Hexagon> = new Map();
    const coordinatesDict = new Map<number, Set<number>>();
    for (let j = 0; j < this.info.size.height; j++) {
      let y = j * this.info.cell.size.radius;
      for (let i = 0; i < this.info.size.width; i++) {
        let x = 
          (j % 2 === 0 ? 1.5 * this.info.cell.size.radius : 0)
          + (i * 3 * this.info.cell.size.radius)
          + this.info.cell.size.diameter;
        if (!coordinatesDict.has(x)) 
          coordinatesDict.set(x, new Set());
        coordinatesDict.get(x)?.add(y);
        hexagons.set(
          JSON.stringify({x, y}),
          new Hexagon(x, y, this.info.cell.size.radius)
        );
      }
    }
    hexagons.forEach((hexagon) => {
      const neighbours = Array.from(hexagons.values()).filter((otherHexagon) => {
        const distance = calculateDistance2Points(hexagon.center, otherHexagon.center);
        return distance > this.info.cell.size.diameter * 0.85 && distance < this.info.cell.size.diameter * 1.15;
      });
      neighbours
        .map((neighbour) => [neighbour, calculateAngle2Points(hexagon.center, neighbour.center)] as [Hexagon, HexagonSideAngles])
        .filter(([neighbour, angle]) => angle)
        .forEach(([neighbour, angle]) => hexagon.setNeighbour(angle, neighbour));
    });
    if (hexagons.size > 0) {
      this.hexagons = hexagons;
      this.coordinatesDict = coordinatesDict;
    }
  }
  */
  //constructor() {
    //window.document.addEventListener('mousemove', throttle(this.trackMousePosition.bind(this), {wait: 1000/60}));
    //window.addEventListener('resize', throttle(this.onResize.bind(this), {wait: 1000/24}));
    //this.cursorParticle = new HexagonParticle(this);
    //this.onResize();
  //}
  /*
  onResize() {
    this.setCanvasSize();
    this.generateHexagons();
    this.updateDockingAreas();
    this.updateTargetAreas();
    this.render();
  }
  */
 /*
  setCanvasSize(canvas: HTMLCanvasElement) {
    if (canvas.parentElement === null) return;
    canvas.width = canvas.parentElement.offsetWidth || 0;
    canvas.height = canvas.parentElement.offsetHeight || 0;
    this.info.size.width = Math.ceil(canvas.width / (2 * this.info.cell.size.radius));
    this.info.size.height = Math.ceil(canvas.height / (this.info.cell.size.radius));
  }
  */
  /*
  trackMousePosition(event: MouseEvent) {
    const canvasBoundingRect = this.canvas.getBoundingClientRect();
    if (
      event.clientX >= canvasBoundingRect.left 
      && event.clientX <= canvasBoundingRect.right
      && event.clientY >= canvasBoundingRect.top
      && event.clientY <= canvasBoundingRect.bottom
    ) {
      const x = Math.floor(event.clientX - canvasBoundingRect.left);
      const y = Math.floor(event.clientY - canvasBoundingRect.top);
      this.mousePosition = {x, y};
      const hexagon = this.findOverlapingHexagon(this.mousePosition);
      if (hexagon) this.cursorParticle.setLocation(hexagon);
    }
  }
  */
  /*
  findOverlapingHexagon(position: {x: number, y: number}): Hexagon | undefined {
    const overlapingHexagonPosition = Array.from(this.coordinatesDict.entries())
      .filter(([x, ySet]) => calculateDistanceSegment(position.x, x) <= this.grid.cell.size.radius)
      .map(([x, ySet]) => 
        Array.from(ySet.values())
          .filter((y) => calculateDistanceSegment(position.y, y) <= this.grid.cell.size.radius)
          .map((y) => ({x, y}))
      )
      .reduce((accumulator, variations) => accumulator.concat(variations), [])
      .find((item) => calculateDistance2Points(position, item) <= this.grid.cell.size.radius);
    return this.hexagons.get(JSON.stringify(overlapingHexagonPosition));
  }
  */
  /*
  updateParticles() {

  }
  generateParticles() {
    while (TargetArea.hasUnassignedTargets() && DockingArea.hasDockingLocations()) {
      const target = TargetArea.nextTarget() as Hexagon;
      const location = DockingArea.nextDockingLocation();
      const particle = new HexagonParticle(this);
      particle.setLocation(location);
      particle.setTarget(target);
    }
  }
  addDockingArea(classNames: string[]) {
    const dockingArea = new DockingArea(this, classNames);
    dockingArea.update();
    this.dockingAreas.add(dockingArea);
  }
  updateDockingAreas() {
    this.dockingAreas.forEach(DockingArea => DockingArea.update());
  }
  addTargetArea(classNames: string[]) {
    const targetArea = new TargetArea(this, classNames);
    targetArea.update();
    this.targetAreas.add(targetArea);
  }
  updateTargetAreas() {
    this.targetAreas.forEach(areaOfInterest => areaOfInterest.update());
  }
  clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawParticles(context: CanvasRenderingContext2D) {
    HexagonParticle.particles
      .filter((particle) => particle.location)
      .forEach((particle) => particle.location?.draw(context));
  }
  drawCursorParticle(context: CanvasRenderingContext2D) {
    if (this.cursorParticle && this.cursorParticle.location) {
      this.cursorParticle.location.draw(context, `rgba(255, 0, 0, 0.55)`);
    }
  }
  drawDockingAreas(context: CanvasRenderingContext2D) {
    DockingArea.locations.forEach((hexagon) => hexagon.draw(context, `rgba(255, 255, 255, 0.15)`));
  }
  render() {
    const context = this.canvas.getContext("2d");
    if (context === null) return;

    this.clearCanvas(context);
    this.drawDockingAreas(context);
    this.drawParticles(context);
    this.drawCursorParticle(context);
  }
  step(delta: number) {
    HexagonParticle.step(delta);
    this.render();
  }
  */
}
