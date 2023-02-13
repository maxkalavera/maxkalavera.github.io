export default function filterConvolutionMatrix(mandelBrotArr: Float32Array, mask: Float32Array) {
  var array = mandelBrotArr.slice()
  let n = Math.sqrt(mask.length)
  let offset = Math.floor(n / 2)
  let sum = 0

  if (n % 2 === 0) {
    throw "Lenght of convolutional mask should be an odd number"
  }

  for (let arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
    sum = 0
    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      sum += (array[arrayIndex + (maskIndex - offset) + (((maskIndex % n) - offset) * n)] || 0) * mask[maskIndex]
    }
    array[arrayIndex] = (sum >= 0 ? sum : 0) % 1.0
  }

  return array
}