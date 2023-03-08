import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import Target from "src/animations/hexagon-grid/Target";
import Particle from "src/animations/hexagon-grid/Particle";
import DockingArea from "src/animations/hexagon-grid/DockingArea";

import type Hexagon from "src/animations/hexagon-grid/Hexagon";
import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";
import type { IndexRect } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class TargetArea extends AreaOfInterest {
  static globalTargetAreas: TargetArea[] = [];
  static locations: Set<Hexagon> = new Set();
  static targets: Target[] = [];
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
    } else {
      // Remove iddle targets
    }
  }
  constructor(
    grid: HexagonGrid,
    className: string,
    element: Element,
    indexRect: IndexRect, 
    hexagons: Hexagon[]
  ) {
    super(grid, className, element, indexRect, hexagons);
    TargetArea.globalTargetAreas.push(this);
    hexagons.forEach((hexagon) => {
      if(!TargetArea.locations.has(hexagon)) {
        TargetArea.locations.add(hexagon);
        new Target(hexagon);
      }
    });
  }
  draw(context: CanvasRenderingContext2D) {
    super.draw(context, `rgba(255, 0, 255, 0.55)`);
  }
}