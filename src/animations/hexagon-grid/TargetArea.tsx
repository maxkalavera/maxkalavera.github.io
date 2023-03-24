import AreaOfInterest from "src/animations/hexagon-grid/AreaOfInterest";

export default class TargetArea extends AreaOfInterest {
  draw(context: CanvasRenderingContext2D) {
    super.draw(context, `rgba(255, 0, 255, 0.55)`);
  }
}