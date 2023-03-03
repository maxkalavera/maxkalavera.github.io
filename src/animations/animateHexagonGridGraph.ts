import getBackgroundCanvas from "src/utils/animations/getBackgroundCanvas";
import throttle from "src/utils/throttle";
import Loop from "src/utils/animations/Loop";

class Hexagon {
  id: number;
  center: {x: number, y: number};
  vertices: {x: number, y: number}[];
  activation: number
  isActive: boolean
  activationDelta: number
  activationMax: number
  activationMin: number
  minOpacity: number
  maxOpacity: number
  constructor(id: number, x: number, y: number, radius: number) {
    this.id=id;
    this.center = {x, y};
    this.activationMin=0.0;
    this.activationMax=1.0;
    this.activation=this.activationMin;
    this.isActive = false;
    this.activationDelta=-1.0;
    this.minOpacity=0.0;
    this.maxOpacity=0.75;
    this.vertices = [
      {x: x - radius * 0.5, y: y + radius},
      {x: x + radius * 0.5, y: y + radius},
      {x: x + radius, y: y},
      {x: x + radius * 0.5, y: y - radius},
      {x: x - radius * 0.5, y: y - radius},
      {x: x - radius, y: y},
    ];
  }
  activate() {
    this.activation = this.activationMax;
  }
  deactivate() {
    this.activation = this.activationMin;
  }
}

class HexagonGrid {
  canvas: HTMLCanvasElement;
  mousePosition = {x: 0, y: 0};
  hexagons: Hexagon[];
  grid: {
    data: (number | undefined)[][]
    size: {width: number, height: number, cells: number}
    cell: {size: {radius: number, diameter: number}}
  } = {
    data: [],
    size: {width: 0, height: 0, cells: 0},
    cell: {size: {radius: 12, diameter: 12 * 2}}
  }
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setCanvasSize();
    this.hexagons = this.generateHexagons();
    this.grid.data = this.generateGridData(this.hexagons);

    window.document.addEventListener('mousemove', throttle(this.trackMousePosition.bind(this), {wait: 1000/60}))
    window.addEventListener('resize', throttle(this.setCanvasSize.bind(this), {wait: 1000/24}))
  }
  setCanvasSize() {
    if (this.canvas === null || this.canvas.parentElement === null) return;
    this.canvas.width = this.canvas.parentElement.offsetWidth || 0;
    this.canvas.height = this.canvas.parentElement.offsetHeight || 0;
    this.grid.size.width = Math.ceil(this.canvas.width / (2 * this.grid.cell.size.radius));
    this.grid.size.height = Math.ceil(this.canvas.height / (this.grid.cell.size.radius));
    this.grid.size.cells = this.grid.size.width * this.grid.size.height;
  }
  trackMousePosition(event: MouseEvent) {
    const canvasBoundingRect = this.canvas.getBoundingClientRect();
    if (
      event.clientX >= canvasBoundingRect.left 
      && event.clientX <= canvasBoundingRect.right
      && event.clientY >= canvasBoundingRect.top
      && event.clientY <= canvasBoundingRect.bottom
    ) {
      const x = Math.floor(event.clientX - canvasBoundingRect.left);
      const y = Math.floor(event.clientY - canvasBoundingRect.top);
      this.mousePosition = {x, y};
      const hexagon = this.hexagons.find((item) => {
        return Math.sqrt(Math.pow(x - item.center.x, 2) + Math.pow(y - item.center.y, 2)) <= this.grid.cell.size.radius;
      });
      if (hexagon) {
        hexagon.activate();
        this.grid.data[hexagon.id].forEach((index) => {
          if (index) this.hexagons[index].activate()
        });
      }
    }
  }
  generateHexagons() {
    const hexagons: Hexagon[] = Array(this.grid.size.cells);
    for (let j = 0; j < this.grid.size.height; j++) {
      let y = Math.floor(j * this.grid.cell.size.radius)
      for (let i = 0; i < this.grid.size.width; i++) {
        let x = Math.floor(
          (j % 2 === 0 ? 1.5 * this.grid.cell.size.radius : 0)
          + (i * 3 * this.grid.cell.size.radius)
          + this.grid.cell.size.diameter);
        const index = (j * this.grid.size.width) + i;
        hexagons[index] = new Hexagon(index, x, y, this.grid.cell.size.radius);
      }
    }
    return hexagons;
  }
  generateGridData(hexagons: Hexagon[]) {
    const data: typeof this.grid.data = new Array(this.grid.size.cells).fill(undefined).map(() => new Array(6).fill(undefined));
    for (let i = 0; i < data.length; i++) {
      data[i][0] = i - this.grid.size.width < data.length ? i - this.grid.size.width : undefined;
      data[i][1] = i - this.grid.size.width + 1 < data.length ? i - this.grid.size.width + 1 : undefined;
      data[i][2] = i - (2 * this.grid.size.width) < data.length ? i - (2 * this.grid.size.width) : undefined;
      data[i][3] = i + this.grid.size.width < data.length ? i + this.grid.size.width : undefined;
      data[i][4] = i + this.grid.size.width + 1 < data.length ? i + this.grid.size.width + 1 : undefined;
      data[i][5] = i + (2 * this.grid.size.width) < data.length ? i + (2 * this.grid.size.width) : undefined;
    }
    return data;
  }
  drawHexagons() {
    const context = this.canvas.getContext("2d");
    if (context === null) return;

    for (const hexagon of this.hexagons) {
      context.beginPath();
      context.shadowBlur = this.grid.cell.size.radius / 2;
      context.shadowColor = '#000000';
      context.strokeStyle = `rgba(255, 255, 255, 255)`;
      context.fillStyle = `rgba(255, 255, 255, 255)`;
      context.strokeStyle = `rgba(255, 255, 255, ${hexagon.activation * 0.01})`
      context.fillStyle = `rgba(255, 255, 255, ${hexagon.minOpacity + (hexagon.activation * (hexagon.maxOpacity - hexagon.minOpacity))})`
      // @ts-ignore
      const vertices = hexagon.vertices;
      if (vertices && vertices.length > 1) {
        context.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          context.lineTo(vertices[i].x, vertices[i].y);
        }
        context.lineTo(vertices[0].x, vertices[0].y);
      }
      context.fill();
      context.stroke();
      context.closePath();
    }
  }
  clearCanvas() {
    const context = this.canvas.getContext("2d")
    if (context === null) return
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  render() {
    this.clearCanvas()
    this.drawHexagons()
  }
  step() {
    this.render();
  }
}

export default function animateHexagonGridGraph() {
  const canvas = getBackgroundCanvas();
  const hexagonGrid = new HexagonGrid(canvas);
  hexagonGrid.render();

  return new Loop().addCallback(() => {
    hexagonGrid.step();
  });
}