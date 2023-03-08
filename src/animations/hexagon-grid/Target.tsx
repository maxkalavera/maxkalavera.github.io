import Hexagon from "src/animations/hexagon-grid/Hexagon";
import Particle from "src/animations/hexagon-grid/Particle";

export default class Target {
  static globalTargets: Target[] = [];
  static getDeactivatedTargets() {
    return Target.globalTargets.filter((target) => !target.isActive);
  }
  location: Hexagon;
  particle: Particle | null;
  isActive: boolean = false;
  constructor(location: Hexagon, particle: Particle | null = null) {
    this.location = location;
    this.particle = particle;
    this.isActive = !!particle;
    Target.globalTargets.push(this);
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
};
