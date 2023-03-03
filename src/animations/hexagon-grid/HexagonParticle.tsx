import Hexagon from "src/animations/hexagon-grid/Hexagon";
//import HexagonGrid from "src/animations/hexagon-grid/Hexagon";
import { calculateAngle2Points } from "src/animations/hexagon-grid/utils";

import type HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";
import type { ParticleBehavior } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class HexagonParticle {
  grid: HexagonGrid;
  cooldown: number;
  location: Hexagon | undefined;
  behavior: ParticleBehavior;
  target: Hexagon | null;
  hasReachedTarget: boolean;
  constructor(grid: HexagonGrid, behavior: ParticleBehavior = 'static') {
    this.grid = grid;
    this.cooldown = 1.0;
    this.behavior = behavior;
    this.target = null;
    this.hasReachedTarget = true;
  }
  setTarget(hexagon: Hexagon) {
    if (this.target) {
      this.target.isTarget = false;
    }
    this.target = hexagon;
    this.target.isTarget = true;
    this.hasReachedTarget = this.location === this.target;
    this.grid.unassignedTargets.delete(hexagon);
  }
  setBehavior(behavior: ParticleBehavior) {
    this.behavior = behavior;
  }
  setLocation(hexagon: Hexagon) {
    if (!(hexagon instanceof Hexagon)) return;
    //if (!hexagon.isEmpty) return;
    //if (this.location) {
    //  this.location.isEmpty = true;
    //}
    this.location = hexagon;
    //this.location.isEmpty = false;
  }
  move() {
    if (!this.location || !this.target) return;
    const neighbourAngle = calculateAngle2Points(this.location.center, this.target.center);
    if (!neighbourAngle) return;
    const neighbourHexagon = this.location.neighbours.get(neighbourAngle);
    if (!neighbourHexagon) return;
    this.setLocation(neighbourHexagon);
  }
  step(delta: number) {
    this.cooldown -= delta;
    if (this.cooldown < 0.0) {
      this.cooldown = 0.0;
    }
    if(this.cooldown <= 0.0 && !this.hasReachedTarget) {
      this.move();
      this.cooldown = 1.0;
      if (this.location === this.target) {
        this.hasReachedTarget = true;
      }
    }
  }
};
