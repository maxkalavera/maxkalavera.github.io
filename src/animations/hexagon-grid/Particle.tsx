import cloneDeep from "lodash/cloneDeep";
import Target from "src/animations/hexagon-grid/Target";

import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d"
import Hexagon from "./Hexagon";

export default class Particle {
  static globalParticles: Set<Particle> = new Set();
  static step() {
    Particle.globalParticles.forEach((particle) => {
      if (particle.target && !particle.target.isActive) {
        particle.target = null;
      }
      particle.move();
    });
  }
  static getParticlesWithoutTarget() {
    return Array.from(Particle.globalParticles).filter((particle) => particle.target === null);
  }

  private position: Coordinate;
  private velocity: number = 5;
  target: Target | null = null;
  targetReached: boolean;
  constructor(departureLocation: Coordinate | Hexagon = [0, 0], target: Target | null = null) {
    this.position = cloneDeep(departureLocation instanceof Hexagon ? departureLocation.center : departureLocation);
    if (target) this.setTarget(target);
    this.targetReached = this.hasReachedTarget();

    Particle.globalParticles.add(this);
  }
  setTarget(target: Target) {
    if (target.particle === null) {
      this.target = target;
      this.target.particle = this;
      this.target.isActive = true;
    }
  }
  removeTarget() {
    if (this.target) {
      this.target.particle = null;
      this.target = null;
    }
  }
  hasReachedTarget() {
    return !this.target || (this.target.location.center[0] === this.position[0] && this.target.location.center[1] === this.position[1]);
  }
  move() {
    if (!this.target || this.targetReached) return;
    const horizontalDiff = this.target.location.center[0] - this.position[0];
    const verticalDiff = this.target.location.center[1] - this.position[1];
    const hypotenuse = Math.sqrt(Math.pow(horizontalDiff, 2) + Math.pow(verticalDiff, 2));
    const directionVector = [horizontalDiff / hypotenuse, verticalDiff / hypotenuse];
    const velocityVector = [
      Math.abs(horizontalDiff) < this.velocity ? horizontalDiff : directionVector[0] * this.velocity,
      Math.abs(verticalDiff) < this.velocity ? verticalDiff : directionVector[1] * this.velocity
    ];
    this.position = [
      this.position[0] + velocityVector[0],
      this.position[1] + velocityVector[1],
    ];
    this.targetReached = this.hasReachedTarget();
  }
  draw(context: CanvasRenderingContext2D, color=`rgba(0, 255, 0, 0.55)`) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(this.position[0], this.position[1], 3, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
  delete() {
    Particle.globalParticles.delete(this);
  }
};