export interface Hexagon {
  center: {x: number, y: number}
  vertices: {x: number, y: number}[]
  activation: number
  activationDelta: number
  activationMax: number
  activationMin: number
  minOpacity: number
  maxOpacity: number
  //alwaysActive: boolean
}