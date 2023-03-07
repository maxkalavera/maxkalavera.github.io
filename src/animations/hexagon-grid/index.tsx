import getBackgroundCanvas from "src/utils/animations/getBackgroundCanvas";
import Loop from "src/utils/animations/Loop";
import HexagonGridAnimation from "src/animations/hexagon-grid/HexagonGridAnimation";

let singleton: HexagonGridAnimation;

export default function animateHexagonGrid() {
  if (!singleton) {
    const canvas = getBackgroundCanvas();
    singleton =  new HexagonGridAnimation(canvas);
    //singleton.addDockingArea(['hexagon-animation-docking']);
    //singleton.addTargetArea(['hexagon-animation-background']);
  }

  return new Loop(1000, 24)
    .addCallback(({delta}) => singleton.step(delta));
}