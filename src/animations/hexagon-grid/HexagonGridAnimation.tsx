import cloneDeep from "lodash/cloneDeep";
import HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";
import DockingArea from "src/animations/hexagon-grid/DockingArea";
import TargetArea from "src/animations/hexagon-grid/TargetArea";
import Particle from "src/animations/hexagon-grid/Particle";
import throttle from "src/utils/throttle";

import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d"
import type Hexagon from "src/animations/hexagon-grid/Hexagon";

interface HexagonGridAnimationInfo {
  canvas: {width: number, height: number}
};

export default class HexagonGridAnimation {
  canvas: HTMLCanvasElement;
  grid: HexagonGrid;
  info: HexagonGridAnimationInfo = {canvas: {width: 0, height: 0}};
  cursorLocation: Hexagon | undefined;
  dockingAreas: DockingArea[] = [];
  dockingAreaLocations: Set<Hexagon> = new Set();
  targetAreas: TargetArea[] = [];
  targetAreaLocations: Set<string> = new Set();
  particles: Set<Particle> = new Set();
  targetToParticle: Map<string, Particle> = new Map();
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.grid = new HexagonGrid(this);
    this.bindListeners();
    this.update();
  }
 updateParticles() {
  const particlesWithoutTarget = Array.from(this.particles).filter((particle) => 
    particle.target === null || !this.targetAreaLocations.has(particle.targetAsKey));
  //console.log('PARTICLES', this.particles.size)
  console.log('PARTICLES WITHOUT TARGET', particlesWithoutTarget.length)
  //console.log('TARGET AREA LOCATIONS', this.targetAreaLocations.size)

  this.targetAreaLocations.forEach((target) => {
    if (!this.targetToParticle.has(target)) {
      const targetCoordinate = JSON.parse(target) as Coordinate;
      if (particlesWithoutTarget.length > 0) {
        const particle = particlesWithoutTarget.pop();
        this.targetToParticle.set(target, particle!);
        particle!.setTarget(targetCoordinate);
      } else {
        const targetCoordinate = JSON.parse(target) as Coordinate;
        const particle = new Particle(DockingArea.assignLocation(this, targetCoordinate), targetCoordinate);
        this.targetToParticle.set(target, particle);
        this.particles.add(particle);
      }
    }
  });

  // Remove unused particles
  //particlesWithoutTarget.forEach((particle) => this.particles.delete(particle));
 }
  bindListeners() {
    window.addEventListener('resize', throttle(this.update.bind(this), {wait: 1000/24}));
    window.document.addEventListener('mousemove', throttle(this.trackMousePosition.bind(this), {wait: 1000/60}));
  }
  update() {
    const info = cloneDeep(this.info);
    this.calculateCanvasSize(info, this.canvas);
    if (JSON.stringify(info) !== JSON.stringify(this.info)) {
      this.updateCanvasSize(info, this.canvas);
      this.grid.update(this.canvas);
      this.updateDockingAreas();
      this.updateTargetAreas();
    }
  }
  calculateCanvasSize(info: HexagonGridAnimationInfo, canvas: HTMLCanvasElement) {
    if (canvas.parentElement === null) return;
    info.canvas.width = canvas.parentElement.offsetWidth || 0;
    info.canvas.height = canvas.parentElement.offsetHeight || 0;
  }
  updateCanvasSize(info: HexagonGridAnimationInfo, canvas: HTMLCanvasElement) {
    canvas.width = info.canvas.width;
    canvas.height = info.canvas.height;
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
      this.cursorLocation = this.grid.findOverlapingHexagon([x, y]);
    }
  }
  addDockingArea(className: string) {
    const dockingAreas = this.grid.getDockingAreasByClassName(className);
    this.dockingAreas = this.dockingAreas.concat(dockingAreas);
    this.dockingAreas.forEach((dockingArea) => 
      dockingArea.hexagons.forEach((location) => 
        this.dockingAreaLocations.add(location)));
  }
  updateDockingAreas() {
    this.dockingAreas.forEach((dockingArea) => dockingArea.update());
    this.dockingAreaLocations = new Set();
    this.dockingAreas.forEach((dockingArea) => 
      dockingArea.hexagons.forEach((location) => 
        this.dockingAreaLocations.add(location)));
  }
  addTargetArea(className: string) {
    const targetAreas = this.grid.getTargetAreasByClassName(className);
    this.targetAreas = this.targetAreas.concat(targetAreas);
    this.targetAreas.forEach((targetArea) => 
      targetArea.hexagons.forEach((location) => 
        this.targetAreaLocations.add(JSON.stringify(location.center))));
  }
  updateTargetAreas() {
    this.targetAreas.forEach((targetArea) => targetArea.update());
    this.targetAreaLocations = new Set();
    this.targetAreas.forEach((targetArea) => 
      targetArea.hexagons.forEach((location) => 
        this.targetAreaLocations.add(JSON.stringify(location.center))));
  }
  clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  render() {
    const context = this.canvas.getContext("2d");
    if (context === null) return;

    this.clearCanvas(context);
    this.grid.draw(context);
    this.dockingAreas.forEach((dockingArea) => dockingArea.draw(context));
    this.targetAreas.forEach((targetArea) => targetArea.draw(context));
    this.particles.forEach((particle) => particle.draw(context));
    this.cursorLocation?.draw(context, `rgba(255, 0, 0, 0.55)`);
  }
  step(delta: number) {
    this.updateParticles();
    this.particles.forEach((particle) => particle.step());
    this.render();
  }
};