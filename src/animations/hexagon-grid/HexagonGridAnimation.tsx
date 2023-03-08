
import cloneDeep from "lodash/cloneDeep";
import HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";
import DockingArea from "src/animations/hexagon-grid/DockingArea";
import TargetArea from "src/animations/hexagon-grid/TargetArea";
import Particle from "src/animations/hexagon-grid/Particle";
import throttle from "src/utils/throttle";

import type Hexagon from "src/animations/hexagon-grid/Hexagon";

interface HexagonGridAnimationInfo {
  canvas: {width: number, height: number}
};

export default class HexagonGridAnimation {
  canvas: HTMLCanvasElement;
  grid: HexagonGrid;
  info: HexagonGridAnimationInfo = {
    canvas: {width: 0, height: 0}
  }
  cursorLocation: Hexagon | undefined;
  dockingAreas: DockingArea[] = [];
  targetAreas: TargetArea[] = [];
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.grid = new HexagonGrid(canvas);
    this.bindListeners();
    this.update();
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
    this.grid.getDockingAreasByClassName(className)
      .forEach((dockingArea) => this.dockingAreas.push(dockingArea));
  }
  addTargetArea(className: string) {
    this.grid.getTargetAreasByClassName(className)
      .forEach((targetArea) => this.targetAreas.push(targetArea));
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
    this.cursorLocation?.draw(context, `rgba(255, 0, 0, 0.55)`);

    // REMOVE
    Particle.globalParticles.forEach((particle) => particle.draw(context));
  }
  step(delta: number) {
    Particle.step();
    TargetArea.step();

    //console.log('Particles ->', Particle.globalParticles.length);
    //console.log('Particles without target ->', Particle.getParticlesWithoutTarget().length);
    //console.log('Deactivated targets -> ', Target.getDeactivatedTargets().length);
    this.render();
  }
};