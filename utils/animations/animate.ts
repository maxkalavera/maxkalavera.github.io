
import AnimationTimer from "utils/animations/AnimationTimer"
import Queue from "utils/data_structures/Queue"

import linear from "utils/animations/linear"

import type { AnimationTimerState } from "utils/animations/AnimationTimer"

interface AnimateCallback {
  (
    progress: number,
    commands: {
      next: () => void
      clear: () => void
    }

  ): void
}

interface AnimationOptions {
  label?: string
  duration?: number // ms
  refreshRate?: number // ms
  timeFunction?: (time: number) => number
}

interface AnimateReturn {
  clear: () => void,
  then: (
    callback: AnimateCallback,
    options: AnimationOptions  
  ) => AnimateReturn
}

interface Animation {
  callback: AnimateCallback,
  options: AnimationOptions
}

const OPTIONS_DEFAULT: AnimationOptions = {
  label: '',
  duration: 3000, // ms
  refreshRate: 40, // ms
  timeFunction: linear
}

export default function animate(
  callback: AnimateCallback,
  options: AnimationOptions = {}
) {
  var queue = Queue<Animation>()
  var animationTimer = AnimationTimer()
  
  const clear = () => {
    animationTimer.stop()
    queue.clear()
  }
  
  const next = () => {
    if (queue.peek() && animationTimer.playingState === 'playing') {
      animationTimer.stop()
      execute()
    }
  }
  
  const execute = () => {
    if (queue.peek() && animationTimer.playingState !== 'playing') {
      let animation = queue.dequeue()
      animationTimer.start((timerState: AnimationTimerState) => {
        let progressTime = (
          (performance.now() - timerState.startTime) % animation.options.duration!) / animation.options.duration!
        let progress = animation.options.timeFunction!(progressTime)
        animation.callback(progress, { next, clear })
      }, animation.options.refreshRate!)
    }
  }

  const then = (
    callback: AnimateCallback,
    options: AnimationOptions = {}
  ) => {
    options = Object.assign(OPTIONS_DEFAULT, options)
    queue.enqueue({ callback, options })
    execute()
    return {
      then: then,
      clear: clear
    }
  }

  // Add first animation to the Que
  options = Object.assign(OPTIONS_DEFAULT, options)
  queue.enqueue({ callback, options })
  execute()

  return {
    then: then,
    clear: clear
  }
}