import getBackgroundCanvas from "src/utils/animations/getBackgroundCanvas";
import Loop from "src/utils/animations/Loop";
import HexagonGrid from "src/animations/hexagon-grid/HexagonGrid";

export default function animateHexagonGrid() {
  const canvas = getBackgroundCanvas();
  const hexagonGrid = new HexagonGrid(canvas);
  hexagonGrid.addDockingArea('hexagon-animation-docking');
  hexagonGrid.addTargetArea('hexagon-animation-background');

  return new Loop(100)
    .addCallback(({delta}) => hexagonGrid.step(delta));
}