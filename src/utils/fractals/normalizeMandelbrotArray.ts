export default function normalizeMandelbrotArray(mandelBrotArr: Float32Array, windowValue: number) {
  var array = mandelBrotArr.slice()
  let ratio = 1.0 / windowValue
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i] * ratio
  }
  return array
}