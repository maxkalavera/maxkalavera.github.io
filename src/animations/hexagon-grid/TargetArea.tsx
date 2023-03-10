import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import Target from "src/animations/hexagon-grid/Target";
import Particle from "src/animations/hexagon-grid/Particle";
import DockingArea from "src/animations/hexagon-grid/DockingArea";

import type Hexagon from "src/animations/hexagon-grid/Hexagon";
import HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";

export default class TargetArea extends AreaOfInterest {
  //static globalTargetAreas: TargetArea[] = [];
  static globalTargetAreas: Set<TargetArea> = new Set();
  static step() {
    TargetArea.generateParticles();
  }
  static generateParticles() {
    const deactivatedTargets = Target.getDeactivatedTargets();
    const particlesWithoutTarget = Particle.getParticlesWithoutTarget();
    if (deactivatedTargets.length > particlesWithoutTarget.length) {
      // Reasign iddle particles
      particlesWithoutTarget.forEach((particle, index) => particle.setTarget(deactivatedTargets[index]));      
      // Create more Particles for missing targets
      for(let i = particlesWithoutTarget.length; i < deactivatedTargets.length; i++) {
        const target = deactivatedTargets[i];
        const departureLocation = DockingArea.assignLocation(target);
        const particle = new Particle(
          departureLocation, 
          target
        );
        target.setParticle(particle);
      }
    } else if (deactivatedTargets.length < particlesWithoutTarget.length) {
      // Reasign iddle particles
      deactivatedTargets.forEach((target, index) => particlesWithoutTarget[index].setTarget(target));  
      // Remove iddle particles
      for(let i = deactivatedTargets.length; i < particlesWithoutTarget.length; i++) {
        particlesWithoutTarget.forEach((particle) => particle.delete());
      }
    }
  }

  localTargets: Target[] = [];
  constructor(
    grid: HexagonGrid,
    className: string,
    element: Element,
    rect: DOMRect,
    hexagons: Hexagon[]
  ) {
    super(grid, className, element, rect, hexagons);
    TargetArea.globalTargetAreas.add(this);
    this.localTargets = this.hexagons.map((hexagon) => Target.getOrCreateByLocation(hexagon));
  }
  update() {
    console.log('UPDATE');
    //this.localTargets.forEach((target) => target.delete());
    this.rect = this.element.getBoundingClientRect();
    this.hexagons = this.grid.locateHexagonsByDOMRect(this.rect);

    const targets = this.hexagons.map((hexagon) => Target.getOrCreateByLocation(hexagon));

    const targetsSet = new Set(targets);
    const diff = this.localTargets.filter(item => !targetsSet.has(item));
    diff.forEach((target) => target.delete());
    console.log('DIFF', this.localTargets.length, targets.length, diff.length)

    this.localTargets = targets;
  }
  draw(context: CanvasRenderingContext2D) {
    super.draw(context, `rgba(255, 0, 255, 0.55)`);
  }
}