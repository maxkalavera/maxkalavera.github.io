import { useEffect, useRef } from "react";

import halfSin from "utils/animations/halfSin"
import drawMandelbrot from "utils/fractals/drawMandelbrot"
import animate from "utils/animations/animate"

function Mandelbrot(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current)
      throw "Canvas element not found"

    var scape = 0.0
    let animation = animate((progress, clear) => {
      scape += progress * 0.05
      if (scape >= 2.0) {
        clear()
      } 
      drawMandelbrot(canvasRef.current!, { scape })
    }, {
      label: 'Mandelbrot begining',
      duration: 10000
    }).then((progress) => {
      scape = 2.0 + (2 * halfSin(progress))
      drawMandelbrot(canvasRef.current!, { scape })
    }, {
      label: 'Mandelbrot middle',
      duration: 8000
    })

    return () => animation.clear()
  }, []);

  return (
    <canvas
      width={768}
      height={768}
      ref={canvasRef}
    />
  )
}

export default Mandelbrot