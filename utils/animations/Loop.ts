import { v4 as uuidv4 } from 'uuid';

import linear from 'utils/animations/linear'


import {LoopOptions, LoopCallback, LoopCallbackData, LoopKeyframe} from 'utils/animations/Loop.d'

var startTime = 0
var timer: NodeJS.Timer = 0 as unknown as NodeJS.Timer
var lastProgress = 0.0
class Loop {
  options: LoopOptions
  callbacks: Map<string, LoopCallbackData>
  playingState: 'idle' | 'playing' | 'paused'

  constructor(
    duration=1000,
    refreshRate=24, 
    timeFunction=linear
  ) {
    this.options = {duration, refreshRate, timeFunction}
    this.callbacks = new Map()
    this.playingState = 'idle'
    timer = 0 as unknown as NodeJS.Timer
  }
  addCallback(callback: LoopCallback, keyframes: LoopKeyframe[] | undefined=undefined, iterationCount: number=0) {
    this.callbacks.set(uuidv4(), {
      keyframes: keyframes 
        ? keyframes
          .map((item) => typeof item === 'number' ? item : parseInt(item))
          .filter((item) => item >= 0 && item <= 100) as LoopKeyframe[]
        : undefined,
      callback,
      iterationCount: iterationCount,
      iterations: 0
    })
  }
  resume() {
    this.playingState = 'playing'
    timer = setInterval(() => {
      for (const callbackID of this.callbacks.keys()) {
        const callbackData = this.callbacks.get(callbackID)
        if (callbackData) {
          const deltaTime = (
            (performance.now() - startTime) % this.options.duration!
          ) / this.options.duration!
          const progress = this.options.timeFunction!(deltaTime)
          if (!callbackData.keyframes 
            || (lastProgress > progress && callbackData.keyframes.some((item) => (lastProgress * 100) >= item && item >= (progress * 100)))
            || (lastProgress <= progress && callbackData.keyframes.some((item) => (lastProgress * 100) <= item && item <= (progress * 100)))
          ) {
            callbackData.callback({
              progress, 
              delta: lastProgress <= progress ? progress - lastProgress : (1.0 - lastProgress) + progress,
              iterations: undefined,
              stop: () => {
                this.callbacks.delete(callbackID)
              }
            })
            lastProgress = progress
          }
        }
      }
    }, this.options.refreshRate)
  }
  stop() {
    clearInterval(timer)
    this.playingState = 'idle'
  }
  pause() {
    clearInterval(timer)
    timer = 0 as unknown as NodeJS.Timer
    this.playingState = 'paused'
  }
}

export default Loop;