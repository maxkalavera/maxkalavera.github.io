import cloneDeep from "lodash/cloneDeep";

import Hexagon from "src/animations/hexagon-grid/Hexagon";

import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class Particle {
  static filterParticlesWithoutTarget(particles: Particle[]) {
    return particles.filter((particle) => particle.target === null);
  }
  private position: Coordinate;
  private velocity: number = 5;
  target: Coordinate | null = null;
  targetAsKey: string = '';
  targetReached: boolean;
  constructor(departureLocation: Coordinate | Hexagon = [0, 0], target: Coordinate | null = null) {
    this.position = cloneDeep(departureLocation instanceof Hexagon ? departureLocation.center : departureLocation);
    if (target) this.setTarget(target);
    this.targetReached = this.hasReachedTarget();
  }
 setTarget(target: Coordinate | null = null) {
  this.target = target;
  this.targetAsKey = JSON.stringify(target);
  this.targetReached = this.hasReachedTarget();
 }
  hasTarget() {
    return this.target !== null;
  }
  hasReachedTarget() {
    return !this.target || (this.target[0] === this.position[0] && this.target[1] === this.position[1]);
  }
  move() {
    if (!this.target || this.targetReached) return;
    const horizontalDiff = this.target[0] - this.position[0];
    const verticalDiff = this.target[1] - this.position[1];
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
  step() {
    if (this.target) {
      this.move();
    }
  }
  draw(context: CanvasRenderingContext2D, color=`rgba(0, 255, 0, 0.55)`) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(this.position[0], this.position[1], 3, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
};