const SCAPE = 3.0
const MAX_ITERATIONS = 100
const FROM = [-2.0, -1.0] as const
const TO = [1.0, 1.0] as const

interface MandelbrotOptions {
  scape?: number
  maxIterations?: number
}

const DEFAULT_OPTIONS = {
  scape: 3.0,
  maxIterations: 100
}

export default function drawMandelbrot(
  canvas: HTMLCanvasElement,
  options: MandelbrotOptions = DEFAULT_OPTIONS
) {
  options = Object.assign(DEFAULT_OPTIONS, options)
  var context = canvas.getContext('2d')
  if (!context)
    throw "Context could not be obtained"
  
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const serializeUnit = Math.max(
    (TO[0] - FROM[0]) / canvas.width,
    (TO[1] - FROM[1]) / canvas.height
  )
  for (let xImage = 0; xImage < canvas.width; xImage++) {
    for (let yImage = 0; yImage < canvas.height; yImage++) {
      let x0 = FROM[0] + (xImage * serializeUnit)
      let y0 = FROM[1] + (yImage * serializeUnit)

      let x = 0
      let y = 0
      let xtemp: number
      let iteration = 0
      while ((x*x + y*y) <= options.scape! && iteration < options.maxIterations!) {
        xtemp = (x * x) - (y * y) + x0
        y = (2 * x * y) + y0
        x = xtemp
        iteration += 1
      }

      if ((x*x + y*y) <= options.scape!) {
        let ratio = (x*x + y*y) / options.scape!
        imageData.data[(4 * xImage) + (4 * yImage * canvas.width)] = 255
        imageData.data[(4 * xImage) + (4 * yImage * canvas.width) + 1] = 255
        imageData.data[(4 * xImage) + (4 * yImage * canvas.width) + 2] = 255
        imageData.data[(4 * xImage) + (4 * yImage * canvas.width) + 3] = 255 * ratio
      }
    }
  }

  context.putImageData(imageData, 0, 0)  
}