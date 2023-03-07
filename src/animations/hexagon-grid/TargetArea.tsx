import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import Hexagon from "src/animations/hexagon-grid/Hexagon";


export default class TargetArea extends AreaOfInterest {
  static targets: Set<Hexagon> = new Set();
  static unassignedTargets: Set<Hexagon> = new Set();
  /*
  update() {
    this.getHTMLElements();
    TargetArea.targets.clear();
    TargetArea.unassignedTargets.clear();
    this.locateHexagonsInArea().forEach((hexagon) => {
      TargetArea.targets.add(hexagon);
      TargetArea.unassignedTargets.add(hexagon);
    });
  }
  static countUnassignedTargets() {
    return TargetArea.unassignedTargets.size;
  }
  static hasUnassignedTargets() {
    return TargetArea.unassignedTargets.size > 0;
  }
  static nextTarget() {
    const target = TargetArea.unassignedTargets.values().next().value as Hexagon | undefined;
    if (target) TargetArea.unassignedTargets.delete(target);
    return target;
  }
  */
};