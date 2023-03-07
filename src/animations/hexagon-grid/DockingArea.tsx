import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";
import Hexagon from "src/animations/hexagon-grid/Hexagon";


export default class DockingArea extends AreaOfInterest {
  static locations: Set<Hexagon> = new Set();
  static _indexCount: number = 0;
  /*
  update() {
    this.getHTMLElements();
    DockingArea.locations.clear();
    this.locateHexagonsInArea().forEach((hexagon) => {
      DockingArea.locations.add(hexagon);
    });
  }
  static hasDockingLocations() {
    return DockingArea.locations.size > 0;
  }
  static nextDockingLocation() {
    return Array.from(DockingArea.locations)[DockingArea._indexCount++ % DockingArea.locations.size];
  }
  */
}