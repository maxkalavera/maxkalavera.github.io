export default function drawMandelbrot(
  canvas: HTMLCanvasElement
) {
  var gl = canvas.getContext("webgl")
  if (!gl)
    throw "Unable to initialize WebGL. Your browser or machine may not support it."

  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}