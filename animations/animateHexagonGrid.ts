import getBackgroundCanvas from "utils/animations/getBackgroundCanvas"
import getAnimator from "utils/animations/getAnimator"
import linear from "utils/animations/linear"
import throttle from "utils/misc/throttle"
import quadratic from "utils/animations/quadratic"
import halfSin from "utils/animations/halfSin"

import type { Hexagon } from "animations/animateHexagonGrid.d"
import type { AnimatorType } from "utils/animations/getAnimator"

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
    cell: {size: {radius: 24, diameter: 24 * 2}}
  }
  onActivationHexagons: Map<string, Hexagon> = new Map()
  hexagons: Map<string, Hexagon> = new Map()
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.canvas.width = canvas.parentElement?.offsetWidth || 0
    this.canvas.height = canvas.parentElement?.offsetHeight || 0
    this.grid.size.width = Math.ceil(this.canvas.width / (2 * this.grid.cell.size.radius))
    this.grid.size.height = Math.ceil(this.canvas.height / (2 * this.grid.cell.size.radius))

    window.document.addEventListener('mousemove', throttle(this.trackMousePosition.bind(this), {wait: 1000/24}))
    this.generateHexagons()
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
  calculateDistance(
    pointA: {x: number, y: number}, 
    pointB: {x: number, y: number}
  ) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y,2))
  }
  findClosestHexagon(position: {x: number, y: number}): Hexagon | undefined {
    for (const key of this.hexagons.keys()) {
      const {x, y} = JSON.parse(key)
      if (this.calculateDistance({x, y}, position) <= this.grid.cell.size.radius) {
        return this.hexagons.get(key)
      }
    }
  }
  generateHexagons() {
    const hexagons: Map<string, Hexagon> = new Map()
    for (let j = 0; j < 50; j++) {
      let y = Math.floor(j * this.grid.cell.size.radius)
      for (let i = 0; i < 50; i++) {
        let x = Math.floor(
          (j % 2 === 0 ? 1.5 * this.grid.cell.size.radius : 0)
          + (i * 3 * this.grid.cell.size.radius)
          + this.grid.cell.size.diameter
        )
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
            activation: 0.0
        })
      }
    }
    this.hexagons = hexagons
  }
  drawHexagons() {
    const context = this.canvas.getContext("2d")
    if (context === null) return

    for (const key of this.hexagons.keys()) {
      const {x, y} = JSON.parse(key)
      if (this.onActivationHexagons.has(key)) {
        const hexagon = this.onActivationHexagons.get(key)!
        context.beginPath()
        context.shadowBlur = this.grid.cell.size.radius / 2
        context.shadowColor = '#000000'
        context.strokeStyle = `rgba(255, 255, 255, ${hexagon.activation * 0.25})`
        context.fillStyle = `rgba(255, 255, 255, ${hexagon.activation * 0.25})`
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
        context.strokeStyle = `rgba(255, 255, 255, ${0.01})`
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
  clearCanvas() {
    const context = this.canvas.getContext("2d")
    if (context === null) return
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  render() {
    this.clearCanvas()
    this.drawHexagons()
  }
  step(progressDelta: number) {
    for (const key of this.onActivationHexagons.keys()) {
      const hexagon = this.onActivationHexagons.get(key)!
      hexagon.activation -= progressDelta
      if (hexagon.activation <= 0.0) {
        hexagon.activation = 0.0
        this.onActivationHexagons.delete(key)
      }
    }
    this.render()
  }
}

export default function animateHexagonGrid(): AnimatorType {
  const animator = getAnimator()
  const canvas = getBackgroundCanvas()
  const hexagonGrid = new HexagonGrid(canvas)

  animator.set(({progressDelta}) => {
    hexagonGrid.step(progressDelta)
  }, {
    label: 'Hexagon Grid',
    refreshRate: 1000 / 6,
    timeFunction: quadratic
  })

  return animator
}