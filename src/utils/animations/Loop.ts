import { v4 as uuidv4 } from 'uuid';

import linear from 'src/utils/animations/functions/linear'

import {LoopOptions, LoopCallback, LoopCallbackData, LoopKeyframe} from 'src/utils/animations/Loop.d'

class Loop {
  options: LoopOptions
  callbacks: Map<string, LoopCallbackData>
  playingState: 'idle' | 'playing' | 'paused'
  startTime = 0
  timer: NodeJS.Timer = 0 as unknown as NodeJS.Timer
  lastProgress = 0.0
  
  constructor(
    duration=1000,
    refreshRate=24, 
    timeFunction=linear
  ) {
    this.options = {duration, refreshRate, timeFunction}
    this.callbacks = new Map()
    this.playingState = 'idle'
    this.timer = 0 as unknown as NodeJS.Timer
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
    return this;
  }
  resume() {
    this.playingState = 'playing'
    this.timer = setInterval(() => {
      for (const callbackID of Array.from(this.callbacks.keys())) {
        const callbackData = this.callbacks.get(callbackID)
        if (callbackData) {
          const deltaTime = (
            (performance.now() - this.startTime) % this.options.duration!
          ) / this.options.duration!
          const progress = this.options.timeFunction!(deltaTime)
          if (!callbackData.keyframes 
            || (this.lastProgress > progress && callbackData.keyframes
              .some((item: LoopKeyframe) => (this.lastProgress * 100) >= item && item >= (progress * 100)))
            || (this.lastProgress <= progress && callbackData.keyframes
              .some((item: LoopKeyframe) => (this.lastProgress * 100) <= item && item <= (progress * 100)))
          ) {
            callbackData.callback({
              progress, 
              delta: this.lastProgress <= progress ? progress - this.lastProgress : (1.0 - this.lastProgress) + progress,
              iterations: undefined,
              stop: () => {
                this.callbacks.delete(callbackID)
              }
            })
            this.lastProgress = progress
          }
        }
      }
    }, this.options.duration! / this.options.refreshRate!)
    return this;
  }
  stop() {
    clearInterval(this.timer)
    this.playingState = 'idle'
    return this;
  }
  pause() {
    clearInterval(this.timer)
    this.timer = 0 as unknown as NodeJS.Timer
    this.playingState = 'paused'
    return this;
  }
}

export default Loop;