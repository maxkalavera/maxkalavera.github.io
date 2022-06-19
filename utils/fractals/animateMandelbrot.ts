import filterConvolutionMatrix from "utils/image_processing/filterConvolutionMatrix"
import normalizeMandelbrotArray from "utils/fractals/normalizeMandelbrotArray"
import getBackgroundCanvas from "utils/animations/getBackgroundCanvas"
import halfSin from "utils/animations/halfSin"
import drawMandelbrot from "utils/fractals/drawMandelbrot"
import getAnimator from "utils/animations/getAnimator"
import * as masks from "utils/image_processing/convolutionMasks"

import type { AnimatorType } from "utils/animations/getAnimator"

const MAX_SCAPE = 4.0

function draw(array: Float32Array, canvas: HTMLCanvasElement) {
  var context = canvas.getContext('2d')
  if (!context) {
    throw "Context could not be obtained"
  }

  let dataArray = new Uint8ClampedArray(4 * canvas.width * canvas.height).fill(0);
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== NaN) {
      dataArray[i * 4] = 255
      dataArray[(i * 4) + 1] = 255
      dataArray[(i * 4) + 2] = 255
      dataArray[(i * 4) + 3] = array[i] * 256
    }
  }

  context.putImageData(
    new ImageData(dataArray, canvas.width, canvas.height), 0, 0)
}

export default function animateMandelbrot(): AnimatorType {
  var animator = getAnimator()
  var canvas = getBackgroundCanvas()

  const setAnimation = (maxSize = 1024) => {
    if (Math.max(window.innerWidth, window.innerHeight) > maxSize) {
      canvas.width = maxSize;
      canvas.height = maxSize;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;  
    }

    var mandelBrotArray = drawMandelbrot(canvas.width, canvas.height, { scape: MAX_SCAPE })
    mandelBrotArray = filterConvolutionMatrix(mandelBrotArray, masks.boxBlurMask)
    animator.set((progress, { stop }) => {
        let array = normalizeMandelbrotArray(mandelBrotArray, 0.3 + (progress * 0.7))
        draw(array, canvas)
        //stop()
      }, {
        label: 'Mandelbrot begining',
        duration: 10000,
        refreshRate: 1000 / 30,
        timeFunction: halfSin
    })
  }

  window.onresize = () => {
    setAnimation()
  }

  setAnimation()

  return animator
}