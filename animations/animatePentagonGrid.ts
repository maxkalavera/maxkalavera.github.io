import getBackgroundCanvas from "utils/animations/getBackgroundCanvas"
import getAnimator from "utils/animations/getAnimator"
import linear from "utils/animations/linear"
import throttle from "utils/misc/throttle"

import type { Pentagon } from "animations/animatePentagonGrid.d"
import type { AnimatorType } from "utils/animations/getAnimator"

class PentagonGrid {
  canvas: HTMLCanvasElement
  grid: {
    data: number[][]
    size: {width: number, height: number}
    cell: {size: {radius: number, diameter: number}}
  } = {
    data: [],
    size: {width: 0, height: 0},
    cell: {size: {radius: 24, diameter: 24 * 2}}
  }
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.canvas.width = canvas.parentElement?.offsetWidth || 0
    this.canvas.height = canvas.parentElement?.offsetHeight || 0
    this.grid.size.width = Math.ceil(this.canvas.width / (2 * this.grid.cell.size.radius))
    this.grid.size.height = Math.ceil(this.canvas.height / (2 * this.grid.cell.size.radius))
  }
  rotateLine(
    degrees: number,
    center: {x: number, y: number},
    tip: {x: number, y: number}
  ) {
    const radians = degrees * (Math.PI / 180)
    return {
      x: Math.floor((Math.cos(radians) * (tip.x - center.x)) - (Math.sin(radians) * (tip.y - center.y)) + center.x),
      y: Math.floor((Math.sin(radians) * (tip.x - center.x)) + (Math.cos(radians) * (tip.y - center.y)) + center.y),
    }
  }
  calculateDistance(
    pointA: {x: number, y: number}, 
    pointB: {x: number, y: number}
  ) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y,2))
  }
  generateVertices() {
    const context = this.canvas.getContext("2d")
    if (context === null) return

    const hexagons: Map<number, Map<number, Pentagon>> = new Map()
    for (let j = 0; j < 50; j++) {
      let y = Math.floor(j * this.grid.cell.size.radius)
      if (!hexagons.has(y)) {
        hexagons.set(y, new Map())
      }
      for (let i = 0; i < 50; i++) {
        let x = Math.floor(
          (j % 2 === 0 ? 1.5 * this.grid.cell.size.radius : 0)
          + (i * 3 * this.grid.cell.size.radius)
          + this.grid.cell.size.diameter
        )
        if (!hexagons.get(y)?.get(x)) {
          hexagons.set(x, new Map())
        }

        hexagons.get(y)?.set(x, {
          center: {x, y},
          vertices: new Array()
        })
        /*
        centers.push({
          x: Math.floor(
            (j % 2 === 0 ? 1.5 * this.grid.cell.size.radius : 0)
            + (i * 3 * this.grid.cell.size.radius)
            + this.grid.cell.size.diameter
          ),
          y
        })
        */
      }
    }

    /*
    const centers: {x: number, y: number}[] = Array()
    for (let j = 0; j < 50; j++) {
      for (let i = 0; i < 50; i++) {        
        centers.push({
          x: Math.floor(
            (j % 2 === 0 ? 1.5 * this.grid.cell.size.radius : 0)
            + (i * 3 * this.grid.cell.size.radius)
            + this.grid.cell.size.diameter
          ),
          y: Math.floor(j * this.grid.cell.size.radius)

        })
      }
    }
    */

    /*
    const vertices: {x: number, y: number}[] = Array()
    for (let j = 0; j < 50; j++) {
      for (let i = 0; i < 50; i++) {
        vertices.push({
          x: Math.floor(
            (Math.floor(i / 2) * this.grid.cell.size.radius) 
            + (Math.floor(i / 2) * this.grid.cell.size.diameter) 
            + ((i % 2 === 0 ? 1 : 0) * this.grid.cell.size.radius)
            + ((j % 2 === 0 ? 1 : 0) * this.grid.cell.size.radius * 1.5)
          ),
          y: Math.floor(j * this.grid.cell.size.radius)
        })
      }
    }
    */

    /*
    console.log('CENTERS', centers.length)
    console.log('VERTICES', vertices.length)

    for (let i = 0; i < vertices.length; i++) {
      context.beginPath()
      context.fillStyle = '#FFFFFF60'  
      context.arc(vertices[i].x, vertices[i].y, 1, 0, 2 * Math.PI)
      context.fill()
      context.closePath()
    }
    for (let i = 0; i < centers.length; i++) {
      context.beginPath()
      context.fillStyle = 'white'  
      context.arc(centers[i].x, centers[i].y, 2, 0, 2 * Math.PI)
      context.fill()
      context.closePath()
    }
    */
  }
  drawHexagon(center: {x: number, y: number}) {
    const context = this.canvas.getContext("2d")
    if (context === null) return

    const angleRadians = (2 * Math.PI) / 6 // 60 degrees

    const vertices = [{
      x: center.x - (this.grid.cell.size.radius / 2),
      y: center.y
    }]
    for (let i = 0; i < 1; i++) {
      vertices.push(this.rotateLine(
        angleRadians,
        center,
        vertices[i]
      ))
    }
  }
  render() {
    this.generateVertices()
  }
}

export default function animatePentagonGrid(): AnimatorType {
  const animator = getAnimator()
  const canvas = getBackgroundCanvas()
  const pentagonGrid = new PentagonGrid(canvas)
  pentagonGrid.render()

  animator.set((progress) => {
  }, {
    label: 'Pentagon Grid',
    refreshRate: 1000 / 6,
    timeFunction: linear
  })

  return animator
}