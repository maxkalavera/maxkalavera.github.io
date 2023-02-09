import getBackgroundCanvas from "utils/animations/getBackgroundCanvas"
import getAnimator from "utils/animations/getAnimator"
import linear from "utils/animations/linear"
import throttle from "utils/misc/throttle"

import type { AnimatorType } from "utils/animations/getAnimator"

const ignoreTypeError = (func: (args?: any[]) => any) => {
  try {
    return func()
  } catch(e) {}
}

class GameOfLife {
  width: number
  height: number
  gameMatrix: Uint8Array[]
  canvas: HTMLCanvasElement
  unitSize = {width: 5, height: 5}
  mousePosition = {x: 0, y: 0}
  lastMousePosition = {x: 0, y: 0}
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.canvas.width = canvas.parentElement?.offsetWidth || 0
    this.canvas.height = canvas.parentElement?.offsetHeight || 0
    this.width = Math.ceil(this.canvas.width / this.unitSize.width)
    this.height = Math.ceil(this.canvas.height / this.unitSize.height)
    this.gameMatrix = new Array(this.width).fill(undefined).map(() => new Uint8Array(this.height).fill(0))
    window.document.addEventListener('mousemove', throttle(this.trackMousePosition.bind(this), {wait: 1000/24}))
    this.draw = throttle(this.draw.bind(this), {resetOnFinish: true})
    this.mousePosition = {x: Math.floor(this.width / 2), y: Math.floor(this.height / 2)}
    this.lastMousePosition = {x: Math.floor(this.width / 2), y: Math.floor(this.height / 2)}
  }
  trackMousePosition(event: MouseEvent) {
    const canvasBoundingRect = this.canvas.getBoundingClientRect()
    if (
      event.clientX >= canvasBoundingRect.left 
      && event.clientX <= canvasBoundingRect.right
      && event.clientY >= canvasBoundingRect.top
      && event.clientY <= canvasBoundingRect.bottom
    ) {
      const x = Math.floor((event.clientX - canvasBoundingRect.left) / this.unitSize.width)
      const y = Math.floor((event.clientY - canvasBoundingRect.top) / this.unitSize.height)

      this.lastMousePosition = this.mousePosition
      this.mousePosition = {x, y}
    }
  }
  countAliveNeighbours(gameMatrix: Uint8Array[]) {
    const neighboursMatrix = new Array(this.width).fill(undefined).map(() => new Uint8Array(this.height).fill(0))
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (gameMatrix[x][y] > 0) {
          neighboursMatrix[x][y] += 1
          ignoreTypeError(() => neighboursMatrix[x-1][y-1] += 1)
          ignoreTypeError(() => neighboursMatrix[x+0][y-1] += 1)
          ignoreTypeError(() => neighboursMatrix[x+1][y-1] += 1)
          ignoreTypeError(() => neighboursMatrix[x-1][y+0] += 1)
          ignoreTypeError(() => neighboursMatrix[x+1][y+0] += 1)
          ignoreTypeError(() => neighboursMatrix[x-1][y+1] += 1)
          ignoreTypeError(() => neighboursMatrix[x+0][y+1] += 1)
          ignoreTypeError(() => neighboursMatrix[x+1][y+1] += 1)
        }
      }
    }
    return neighboursMatrix
  }
  updateGameMatrix(gameMatrix: Uint8Array[], neighboursMatrix: Uint8Array[]) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (gameMatrix[x][y] && (neighboursMatrix[x][y] < 2 || neighboursMatrix[x][y] > 3)) {
          gameMatrix[x][y] = 0
        } else if (neighboursMatrix[x][y] === 3) {
          gameMatrix[x][y] = 1
        }
       /*
        // High life version
        if (gameMatrix[x][y] && (neighboursMatrix[x][y] !== 3 && neighboursMatrix[x][y] !== 6)) {
          gameMatrix[x][y] = 0
        } else if (neighboursMatrix[x][y] === 2 || neighboursMatrix[x][y] === 3) {
          gameMatrix[x][y] = 1
        }
       */
      }
    }
    return gameMatrix
  }
  drawCell(x: number, y: number) {
    const context = this.canvas.getContext('2d')
    if (context === null) throw('Canvas context was not obtained')
    context.beginPath()
    context.fillStyle = '#9E9E9E30'
    context.rect(
      Math.imul(x, this.unitSize.width), 
      Math.imul(y, this.unitSize.height), 
      this.unitSize.width, 
      this.unitSize.height
    )
    context.fill()  
  }
  draw(gameMatrix: Uint8Array[]) {
    const context = this.canvas.getContext('2d')
    if (context === null) throw('Canvas context was not obtained')
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if(gameMatrix[x][y]) {
          this.drawCell(x, y)
        }
      }
    }
  }
  spreadCell(gameMatrix: Uint8Array[]) {
    const {x, y} = this.mousePosition    
    ignoreTypeError(() => gameMatrix[x-1][y-1] = 1)
    ignoreTypeError(() => gameMatrix[x+0][y-1] = 1)
    ignoreTypeError(() => gameMatrix[x+1][y-1] = 1)
    ignoreTypeError(() => gameMatrix[x-1][y+0] = 1)
    ignoreTypeError(() => gameMatrix[x+0][y+0] = 1)
    ignoreTypeError(() => gameMatrix[x+1][y+0] = 1)
    ignoreTypeError(() => gameMatrix[x-1][y+1] = 1)
    ignoreTypeError(() => gameMatrix[x+0][y+1] = 1)
    ignoreTypeError(() => gameMatrix[x+1][y+1] = 1)

    return gameMatrix
  }
  next() {
    let gameMatrix = this.gameMatrix.map((item) => item.slice())
    gameMatrix = this.spreadCell(gameMatrix)
    const neighboursMatrix = this.countAliveNeighbours(gameMatrix)
    gameMatrix = this.updateGameMatrix(gameMatrix, neighboursMatrix)
    this.draw(gameMatrix)
    this.gameMatrix = gameMatrix
  }
}

export default function animateGameOfLife(): AnimatorType {
  const animator = getAnimator()
  const canvas = getBackgroundCanvas()
  const gameOfLife = new GameOfLife(canvas)

  animator.set(() => {
    gameOfLife.next()
  }, {
    label: 'Conway\'s Game of life',
    refreshRate: 1000 / 6,
    timeFunction: linear
  })

  return animator
}