export default function drawMandelbrot(
  canvas: HTMLCanvasElement
) {
  var context = canvas.getContext('2d')
  if (!context)
    throw "Context could not be obtained"

  context.clearRect(0, 0, canvas.width, canvas.height)
}