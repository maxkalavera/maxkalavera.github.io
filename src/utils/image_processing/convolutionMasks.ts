const IdentityMask = new Float32Array([
  0, 0, 0, 0, 1, 0, 0, 0, 0
])

const ridgeMask = new Float32Array([
  -1, -1, -1, -1, 6, -1, -1, -1, -1
])

const sharpenMask = new Float32Array([
  0, -1, 0, -1, 5, -1, 0, -1, 0
])

const boxBlurMask = new Float32Array([
  1, 1, 1, 1, 1, 1, 1, 1, 1
].map((item) => item * (1/9)))

const gaussianBlurThreeMask = new Float32Array([
  1, 2, 1, 2, 4, 2, 1, 2, 1
].map((item) => item * (1/9)))

const gaussianBlurFiveMask = new Float32Array([
  1, 4, 6, 4, 1,
  4, 16, 24, 16, 4,
  6, 24, 36, 24, 6,
  4, 16, 24, 16, 4,
  1, 4, 6, 4, 1
].map((item) => item * (1/256)))

const unsharpMask = new Float32Array([
  1, 4, 6, 4, 1,
  4, 16, 24, 16, 4,
  6, 24, -476, 24, 6,
  4, 16, 24, 16, 4,
  1, 4, 6, 4, 1
].map((item) => item * (-1/256)))


export {
  IdentityMask,
  ridgeMask,
  sharpenMask,
  boxBlurMask,
  gaussianBlurThreeMask,
  gaussianBlurFiveMask,
  unsharpMask
}