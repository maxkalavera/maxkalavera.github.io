import Hexagon from "src/animations/hexagon-grid/Hexagon";
import { calculateAngle2Points } from "src/animations/hexagon-grid/utils";

import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";
import type { ParticleBehavior } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class HexagonParticle {
  static particles: HexagonParticle[] = [];
  static cooldown: number = 1.0;
  grid: HexagonGrid;
  location: Hexagon | undefined;
  behavior: ParticleBehavior;
  target: Hexagon | null;
  hasReachedTarget: boolean;
  static step(delta: number) {
    this.cooldown -= delta;
    if (this.cooldown < 0.0) {
      this.cooldown = 0.0;
    }
    if(this.cooldown <= 0.0) {
      HexagonParticle.particles
        .filter((particle) => !particle.hasReachedTarget)
        .forEach((particle) => particle.move());
      this.cooldown = 1.0;
    }
  }
  constructor(grid: HexagonGrid, behavior: ParticleBehavior = 'static') {
    this.grid = grid;
    this.behavior = behavior;
    this.target = null;
    this.hasReachedTarget = this.location === this.target;
    HexagonParticle.particles.push(this);
  }
  setTarget(hexagon: Hexagon) {
    if (this.target) {
      this.target.isTarget = false;
    }
    this.target = hexagon;
    this.target.isTarget = true;
  }
  setBehavior(behavior: ParticleBehavior) {
    this.behavior = behavior;
  }
  setLocation(hexagon: Hexagon) {
    if (!(hexagon instanceof Hexagon)) return;
    this.location = hexagon;
  }
  move() {
    if (!this.location || !this.target || this.hasReachedTarget) return;
    const neighbourAngle = calculateAngle2Points(this.location.center, this.target.center);
    if (!neighbourAngle) return;
    const neighbourHexagon = this.location.neighbours.get(neighbourAngle);
    if (!neighbourHexagon) return;
    this.setLocation(neighbourHexagon);
    this.hasReachedTarget = this.location === this.target;
  }
};
