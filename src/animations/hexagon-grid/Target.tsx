import Hexagon from "src/animations/hexagon-grid/Hexagon";
import Particle from "src/animations/hexagon-grid/Particle";

import type { Coordinate } from "src/animations/hexagon-grid/hexagon-grid.d";

export default class Target {
  static globalTargets: Set<Target> = new Set();
  static hexagonToTargetMap: Map<string, Target> = new Map();
  static getDeactivatedTargets() {
    return Array.from(Target.globalTargets).filter((target) => !target.isActive);
  }
  static getOrCreateByLocation(location: Hexagon): Target {
    if (Target.hexagonToTargetMap.has(JSON.stringify(location.center))) {
      return Target.hexagonToTargetMap.get(JSON.stringify(location.center))!;
    } else {
      const target = new Target(location);
      Target.hexagonToTargetMap.set(JSON.stringify(location.center), target)
      return target;
    }
  }
  location: Hexagon;
  particle: Particle | null = null;
  isActive: boolean = false;
  constructor(location: Hexagon) {
    this.location = location;
    Target.globalTargets.add(this);
  }
  setParticle(particle: Particle) {
    if (particle.target === null) {
      this.particle = particle;
      this.isActive = true;
    }
  }
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
    if (this.particle) {
      this.particle.target = null;
      this.particle = null;
    }
  }
  hasParticleReachedTarget() {
    return false;
  }
  delete() {
    console.log('DELETE TARGET')
    this.deactivate();
    Target.hexagonToTargetMap.delete(JSON.stringify(this.location.center))
    Target.globalTargets.delete(this);
  }
};
