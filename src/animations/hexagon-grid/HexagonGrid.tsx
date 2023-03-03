import Hexagon from "src/animations/hexagon-grid/Hexagon";
import HexagonParticle from "src/animations/hexagon-grid/HexagonParticle";
import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import throttle from "src/utils/throttle";
import {distance2Points, calculateAngle2Points} from "src/animations/hexagon-grid/utils";

import type { Coordinate, HexagonSideAngles } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class HexagonGrid {
  canvas: HTMLCanvasElement
  mousePosition: Coordinate = {x: 0, y: 0}
  grid: {
    data: number[][]
    size: {width: number, height: number}
    cell: {size: {radius: number, diameter: number}}
  } = {
    data: [],
    size: {width: 0, height: 0},
    cell: {size: {radius: 12, diameter: 12 * 2}}
  }
  coordinatesDict: Map<number, Set<number>> = new Map();
  hexagons: Map<string, Hexagon> = new Map();
  cursorParticle: HexagonParticle;
  particles: Set<HexagonParticle> = new Set();
  particlesWithoutTarget: Set<HexagonParticle> = new Set();
  targets: Set<Hexagon> = new Set();
  dockingHexagons: Set<Hexagon> = new Set();
  unassignedTargets: Set<Hexagon> = new Set();
  dockingAreas: AreaOfInterest[] = [];
  targetAreas: AreaOfInterest[] = [];
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setCanvasSize();
    window.document.addEventListener('mousemove', throttle(this.trackMousePosition.bind(this), {wait: 1000/60}));
    window.addEventListener('resize', throttle(this.setCanvasSize.bind(this), {wait: 1000/24}));
    this.cursorParticle = new HexagonParticle(this);
    this.generateHexagons();
  }
  setCanvasSize() {
    if (this.canvas === null || this.canvas.parentElement === null) return;
    this.canvas.width = this.canvas.parentElement.offsetWidth || 0;
    this.canvas.height = this.canvas.parentElement.offsetHeight || 0;
    this.grid.size.width = Math.ceil(this.canvas.width / (2 * this.grid.cell.size.radius));
    this.grid.size.height = Math.ceil(this.canvas.height / (this.grid.cell.size.radius));
    this.updateAreasOfInterest();
    this.render();
  }
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
  calculateDistance2D(CoordinateA: {x: number, y: number}, CoordinateB: {x: number, y: number}) {
    return Math.sqrt(
      Math.pow(CoordinateA.x - CoordinateB.x, 2) + Math.pow(CoordinateA.y - CoordinateB.y, 2)
    );
  }
  calculateDistance1D(valueA: number, valueB: number) {
    return Math.abs(valueB - valueA)
  }
  findOverlapingHexagon(position: {x: number, y: number}): Hexagon | undefined {
    const overlapingHexagonPosition = Array.from(this.coordinatesDict.entries())
      .filter(([x, ySet]) => this.calculateDistance1D(position.x, x) <= this.grid.cell.size.radius)
      .map(([x, ySet]) => 
        Array.from(ySet.values())
          .filter((y) => this.calculateDistance1D(position.y, y) <= this.grid.cell.size.radius)
          .map((y) => ({x, y}))
      )
      .reduce((accumulator, variations) => accumulator.concat(variations), [])
      .find((item) => this.calculateDistance2D(position, item) <= this.grid.cell.size.radius);
    return this.hexagons.get(JSON.stringify(overlapingHexagonPosition));
  }
  generateHexagons() {
    const hexagons: Map<string, Hexagon> = new Map();
    const coordinatesDict = new Map<number, Set<number>>();
    for (let j = 0; j < this.grid.size.height; j++) {
      let y = j * this.grid.cell.size.radius;
      for (let i = 0; i < this.grid.size.width; i++) {
        let x = 
          (j % 2 === 0 ? 1.5 * this.grid.cell.size.radius : 0)
          + (i * 3 * this.grid.cell.size.radius)
          + this.grid.cell.size.diameter;
        if (!coordinatesDict.has(x)) 
          coordinatesDict.set(x, new Set());
        coordinatesDict.get(x)?.add(y);
        hexagons.set(
          JSON.stringify({x, y}),
          new Hexagon(x, y, this.grid.cell.size.radius)
        );
      }
    }
    hexagons.forEach((hexagon) => {
      const neighbours = Array.from(hexagons.values()).filter((otherHexagon) => {
        const distance = distance2Points(hexagon.center, otherHexagon.center);
        return distance > this.grid.cell.size.diameter * 0.85 && distance < this.grid.cell.size.diameter * 1.15;
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
  generateHexagonParticles() {
    let dockingIterator = this.dockingHexagons.values();
    this.unassignedTargets.forEach((target) => {
      let location = dockingIterator.next().value as Hexagon |  undefined;
      if (!location) {
        dockingIterator = this.dockingHexagons.values();
        location = dockingIterator.next().value as Hexagon |  undefined;
      }
      if (location) {
        const particle = new HexagonParticle(this);
        particle.setLocation(location);
        particle.setTarget(target);
        this.particles.add(particle);
      }
    });
    this.unassignedTargets.clear();
  }
  drawHexagon(context: CanvasRenderingContext2D, hexagon: Hexagon, color=`rgba(255, 255, 255, 0.15)`) {
    context.beginPath();
    context.strokeStyle = color;
    context.fillStyle = color;
    const vertices = hexagon.vertices;
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
  drawHexagons() {
    const context = this.canvas.getContext("2d");
    if (context === null) return;
    this.particles.forEach((particle) => {
      if (particle.location) this.drawHexagon(context, particle.location);
    });
    if (this.cursorParticle && this.cursorParticle.location) {
      this.drawHexagon(context, this.cursorParticle.location, `rgba(255, 0, 0, 0.55)`);
    }
  }
  updateAreasOfInterest() {
    this.dockingAreas.forEach(areaOfInterest => areaOfInterest.update());
    this.targetAreas.forEach(areaOfInterest => areaOfInterest.update());
  }
  addDockingArea(className: string) {
    const dockingArea = new AreaOfInterest(this, className);
    dockingArea.update();
    dockingArea.hexagons.forEach((hexagon) => {
      this.dockingHexagons.add(hexagon)
      const particle = new HexagonParticle(this);
      particle.setLocation(hexagon);
      this.particles.add(particle);
    });
    this.dockingAreas.push(dockingArea);
  }
  removeDockingArea(className: string) {

  }
  addTargetArea(className: string) {
    const targetArea = new AreaOfInterest(this, className);
    targetArea.update();
    targetArea.hexagons.forEach((hexagon) => {
      this.targets.add(hexagon);
      this.unassignedTargets.add(hexagon);
    });
    this.targetAreas.push(targetArea);
    this.generateHexagonParticles();
  }
  removeTargetArea(classname: string) {
    
  }
  updateHexagonsState() {
  }
  clearCanvas() {
    const context = this.canvas.getContext("2d");
    if (context === null) return;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  render() {
    this.clearCanvas();
    this.drawHexagons();
  }
  step(delta: number) {
    this.updateHexagonsState();
    //this.generateHexagonParticles();
    this.particles.forEach((particle) => particle.step(delta));
    this.render();
  }
}
