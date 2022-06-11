import clearCanvas from "utils/animations/clearCanvas"
import halfSin from "utils/animations/halfSin"
import drawMandelbrot from "utils/fractals/drawMandelbrot"
import animate from "utils/animations/animate"


export default function animateMandelbrot() {
  var canvas = document.getElementById('canvas-background') as HTMLCanvasElement
  var scape = 0.0
  return animate((progress, { next }) => {
    scape += progress * 0.05
    if (scape >= 2.0) {
      next()
    } 
    drawMandelbrot(canvas, { scape })
  }, {
    label: 'Mandelbrot begining',
    duration: 10000
  }).then((progress) => {
    scape = 2.0 + (2 * halfSin(progress))
    clearCanvas(canvas)
    drawMandelbrot(canvas, { scape })
  }, {
    label: 'Mandelbrot middle',
    duration: 8000
  }) 
}