import getBackgroundCanvas from "src/utils/animations/getBackgroundCanvas"
import throttle from "src/utils/throttle"
import Loop from "src/utils/animations/Loop"

import type { Hexagon } from "src/animations/animateHexagonGrid.d"

class HexagonGrid {
  canvas: HTMLCanvasElement
  mousePosition = {x: 0, y: 0}
  grid: {
    data: number[][]
    size: {width: number, height: number}
    cell: {size: {radius: number, diameter: number}}
  } = {
    data: [],
    size: {width: 0, height: 0},
    cell: {size: {radius: 14, diameter: 14 * 2}}
  }
  horizontalHexagonCoordinates: number[] = []
  verticalHexagonCoordinates: number[] = []
  onActivationHexagons: Map<string, Hexagon> = new Map()
  hexagons: Map<string, Hexagon> = new Map()
  areasOfInterest: {element: HTMLElement, rect: DOMRect, hexagons: Map<string, Hexagon>}[] = []
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.setCanvasSize()
    window.document.addEventListener('mousemove', throttle(this.trackMousePosition.bind(this), {wait: 1000/60}))
    window.addEventListener('resize', throttle(this.setCanvasSize.bind(this), {wait: 1000/24}))
    this.generateHexagons()
  }
  setCanvasSize() {
    if (this.canvas === null || this.canvas.parentElement === null) return;
    this.canvas.width = this.canvas.parentElement.offsetWidth || 0
    this.canvas.height = this.canvas.parentElement.offsetHeight || 0
    this.grid.size.width = Math.ceil(this.canvas.width / (2 * this.grid.cell.size.radius))
    this.grid.size.height = Math.ceil(this.canvas.height / (this.grid.cell.size.radius))
    this.updateAreasOfInterest()
    this.render()
  }
  trackMousePosition(event: MouseEvent) {
    const canvasBoundingRect = this.canvas.getBoundingClientRect()
    if (
      event.clientX >= canvasBoundingRect.left 
      && event.clientX <= canvasBoundingRect.right
      && event.clientY >= canvasBoundingRect.top
      && event.clientY <= canvasBoundingRect.bottom
    ) {
      const x = Math.floor(event.clientX - canvasBoundingRect.left)
      const y = Math.floor(event.clientY - canvasBoundingRect.top)
      this.mousePosition = {x, y}
      const hexagon = this.findClosestHexagon(this.mousePosition)
      if (hexagon && !this.onActivationHexagons.get(JSON.stringify(hexagon.center))) {
        hexagon.activation = 1.0
        this.onActivationHexagons.set(JSON.stringify(hexagon.center), hexagon)
      }
    }
  }
  calculateDistance2D(
    pointA: {x: number, y: number}, 
    pointB: {x: number, y: number}
  ) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2))
  }
  calculateDistance1D(valueA: number, valueB: number) {
    return Math.abs(valueB - valueA)
  }
  findClosestHexagon(position: {x: number, y: number}): Hexagon | undefined {
    const horizontals = this.horizontalHexagonCoordinates.filter((item) => 
      this.calculateDistance1D(position.x, item) <= this.grid.cell.size.radius)
    const verticals = this.verticalHexagonCoordinates.filter((item) => 
      this.calculateDistance1D(position.y, item) <= this.grid.cell.size.radius)
    const variations = horizontals.reduce(
      (values, x) => values.concat(
        verticals.map((y) => ({x, y} as never)) as never[]), [])
    const key = variations.map((item) => JSON.stringify(item) || '').find((item) => this.hexagons.has(item))
    return key ? this.hexagons.get(key) : undefined
  }
  generateHexagons() {
    const hexagons: Map<string, Hexagon> = new Map()
    const horizontalCoordinates = new Map()
    const verticalCoordinates = new Map()
    for (let j = 0; j < this.grid.size.height; j++) {
      let y = Math.floor(j * this.grid.cell.size.radius)
      verticalCoordinates.set(y, y)
      for (let i = 0; i < this.grid.size.width; i++) {
        let x = Math.floor(
          (j % 2 === 0 ? 1.5 * this.grid.cell.size.radius : 0)
          + (i * 3 * this.grid.cell.size.radius)
          + this.grid.cell.size.diameter
        )
        horizontalCoordinates.set(x, x)
        hexagons.set(
          JSON.stringify({x, y}), 
          {
            center: {x, y},
            vertices: [
              {x: x - this.grid.cell.size.radius * 0.5, y: y + this.grid.cell.size.radius},
              {x: x + this.grid.cell.size.radius * 0.5, y: y + this.grid.cell.size.radius},
              {x: x + this.grid.cell.size.radius, y: y},
              {x: x + this.grid.cell.size.radius * 0.5, y: y - this.grid.cell.size.radius},
              {x: x - this.grid.cell.size.radius * 0.5, y: y - this.grid.cell.size.radius},
              {x: x - this.grid.cell.size.radius, y: y},
            ],
            activation: 0.0,
            activationMin: 0.0,
            activationMax: 1.0,
            activationDelta: -1.0,
            minOpacity: 0.0,
            maxOpacity: 0.75
        })
      }
    }
    if (hexagons.size > 0) {
      this.hexagons = hexagons
      this.horizontalHexagonCoordinates = Array.from(horizontalCoordinates.keys())
      this.verticalHexagonCoordinates = Array.from(verticalCoordinates.keys())
    }
  }
  drawHexagons() {
    const context = this.canvas.getContext("2d")
    if (context === null) return

    for (const key of Array.from(this.hexagons.keys())) {
      if (this.onActivationHexagons.has(key)) {
        const hexagon = this.onActivationHexagons.get(key)!
        context.beginPath()
        context.shadowBlur = this.grid.cell.size.radius / 2
        context.shadowColor = '#000000'
        context.strokeStyle = `rgba(255, 255, 255, ${hexagon.activation * 0.01})`
        context.fillStyle = `rgba(255, 255, 255, ${hexagon.minOpacity + (hexagon.activation * (hexagon.maxOpacity - hexagon.minOpacity))})`
        // @ts-ignore
        const vertices = this.hexagons.get(key).vertices
        if (vertices && vertices.length > 1) {
          context.moveTo(vertices[0].x, vertices[0].y)
          for (let i = 1; i < vertices.length; i++) {
            context.lineTo(vertices[i].x, vertices[i].y)
          }
          context.lineTo(vertices[0].x, vertices[0].y)
        }
        context.fill()
        context.stroke()
        context.closePath()  

      } else {
        context.beginPath()
        context.shadowBlur = this.grid.cell.size.radius / 2
        context.shadowColor = '#FFFFFFFF'
        context.strokeStyle = `rgba(255, 255, 255, ${0.00})`
        // @ts-ignore
        const vertices = this.hexagons.get(key).vertices
        if (vertices && vertices.length > 1) {
          context.moveTo(vertices[0].x, vertices[0].y)
          for (let i = 1; i < vertices.length; i++) {
            context.lineTo(vertices[i].x, vertices[i].y)
          }
          context.lineTo(vertices[0].x, vertices[0].y)
        }
        context.stroke()
        context.closePath()  
      }
    }
  }
  updateAreasOfInterest() {
    this.areasOfInterest.forEach((areaOfInterest) => {
      areaOfInterest.hexagons.forEach((hexagon) => {
        hexagon.activationDelta = -1.0;
      })
    })
    
    this.areasOfInterest.forEach((areaOfInterest) => {
      areaOfInterest.rect = areaOfInterest.element.getBoundingClientRect()
      const horizontals = this.horizontalHexagonCoordinates.filter(
        (item) => item >= areaOfInterest.rect.left && item <= areaOfInterest.rect.right)
      const verticals = this.verticalHexagonCoordinates.filter(
        (item) => item >= areaOfInterest.rect.top && item <= areaOfInterest.rect.bottom)
      const variations = horizontals.reduce(
        (values, x) => values.concat(
          verticals.map((y) => ({x, y} as never)) as never[]), [])
      const hexagonsMapItems: [string, Hexagon][] = variations
        .map((item) => JSON.stringify(item) || '')
        .filter((item) => this.hexagons.has(item)) // extract keys
        .map((item) => [item, this.hexagons.get(item) as Hexagon])
      areaOfInterest.hexagons = new Map(hexagonsMapItems)
      this.areasOfInterest[this.areasOfInterest.length - 1].hexagons.forEach((hexagon) => {
        hexagon.activationMin = 0.05 + (Math.random() * 0.15)
        hexagon.activationMax = 0.5 + (Math.random() * 0.45)
        hexagon.activation = hexagon.activationMin;
        hexagon.activationDelta = +0.2;
        this.onActivationHexagons.set(JSON.stringify(hexagon.center), hexagon)
      })
    })
  }
  addAreaOfInterest(className: string){
    const elements = document.getElementsByClassName(className)
    for (const element of Array.from(elements)) {
      const rect = element.getBoundingClientRect()
      const horizontals = this.horizontalHexagonCoordinates.filter(
        (item) => item >= rect.left && item <= rect.right)
      const verticals = this.verticalHexagonCoordinates.filter(
        (item) => item >= rect.top && item <= rect.bottom)
      const variations = horizontals.reduce(
        (values, x) => values.concat(
          verticals.map((y) => ({x, y} as never)) as never[]), [])
      const hexagonsMapItems: [string, Hexagon][] = variations
        .map((item) => JSON.stringify(item) || '')
        .filter((item) => this.hexagons.has(item)) // extract keys
        .map((item) => [item, this.hexagons.get(item) as Hexagon])
      this.areasOfInterest.push({
        element: element as HTMLElement, 
        rect, 
        hexagons: new Map(hexagonsMapItems)
      })
      this.areasOfInterest[this.areasOfInterest.length - 1].hexagons.forEach((hexagon) => {
        hexagon.activationMin = 0.05 + (Math.random() * 0.15)
        hexagon.activationMax = 0.5 + (Math.random() * 0.45)
        hexagon.activation = hexagon.activationMin;
        hexagon.activationDelta = +0.2;
        this.onActivationHexagons.set(JSON.stringify(hexagon.center), hexagon)
      })
    }
  }
  updateHexagonsState(delta: number=0.1) {
    for (const key of Array.from(this.onActivationHexagons.keys())) {
      const hexagon = this.onActivationHexagons.get(key)!
      hexagon.activation += (delta * hexagon.activationDelta) 
      if (hexagon.activation <= hexagon.activationMin) {
        hexagon.activation = hexagon.activationMin
        this.onActivationHexagons.delete(key)
      } else if (hexagon.activation >= hexagon.activationMax) {
        hexagon.activation = hexagon.activationMax
      }
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
    this.updateHexagonsState()
    this.render()
  }
}

export default function animateHexagonGrid() {
  //const animator = getAnimator()
  const canvas = getBackgroundCanvas()
  const hexagonGrid = new HexagonGrid(canvas)
  hexagonGrid.addAreaOfInterest('hexagon-background-animation')

  const animator = new Loop()
  animator.addCallback(({delta}) => {
    hexagonGrid.updateHexagonsState(delta)
    hexagonGrid.render()
  })

  return animator
}