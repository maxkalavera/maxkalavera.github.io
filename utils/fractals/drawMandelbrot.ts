const SCAPE = 3.0
const MAX_ITERATIONS = 100
const FROM = [-2.0, -1.0] as const
const TO = [1.0, 1.0] as const

interface MandelbrotOptions {
  scape?: number
  maxIterations?: number
}

const DEFAULT_OPTIONS = {
  scape: 2.0,
  maxIterations: 100
}

export default function drawMandelbrot(
  //canvas: HTMLCanvasElement,
  width: number,
  height: number,
  options: MandelbrotOptions = DEFAULT_OPTIONS
) {
  options = Object.assign(DEFAULT_OPTIONS, options)

  var arr = new Float32Array(width * height);
  const serializeUnit = Math.max(
    (TO[0] - FROM[0]) / width,
    (TO[1] - FROM[1]) / height
  )
  for (let xImage = 0; xImage < width; xImage++) {
    for (let yImage = 0; yImage < height; yImage++) {
      let x0 = FROM[0] + (xImage * serializeUnit)
      let y0 = FROM[1] + (yImage * serializeUnit)

      let x = 0
      let y = 0
      let xtemp: number
      let iteration = 0
      while (iteration < options.maxIterations! && (x*x + y*y) <= options.scape!) {
        xtemp = (x * x) - (y * y) + x0
        y = (2 * x * y) + y0
        x = xtemp
        iteration += 1
      }

      if ((x*x + y*y) <= options.scape!) {
        arr[xImage + (yImage * width)] = (x*x + y*y) / options.scape!
      } else {
        arr[xImage + (yImage * width)] = 0
      }

    }
  }

  //context.putImageData(new ImageData(arr, canvas.width, canvas.height), 0, 0)
  return arr
}