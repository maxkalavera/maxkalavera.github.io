import { useCallback, useEffect, useRef, useState } from "react"

import AnimationTimer from "utils/animations/AnimationTimer"
import Queue from "utils/data_structures/Queue"
import linear from "utils/animations/linear"

import { QueueType } from "utils/data_structures/Queue"
import type { AnimationTimerType, AnimationTimerState } from "utils/animations/AnimationTimer"

interface AnimateCallback {
  (
    options: {
      progress: number,
      progressDelta: number,
      next: () => void
      stop: () => void
    }

  ): void
}

interface AnimationOptions {
  label?: string
  duration?: number // ms
  refreshRate?: number // ms
  timeFunction?: (time: number) => number
}

interface AnimationType {
  callback: AnimateCallback,
  options: AnimationOptions
}

interface AnimationThenType {
  then: (
    callback: AnimateCallback,
    options: AnimationOptions  
  ) => AnimationThenType
  stop: () => void
}

export interface AnimatorType {
  add: (
    callback: AnimateCallback,
    options: AnimationOptions  
  ) => AnimationThenType
  set: (
    callback: AnimateCallback,
    options: AnimationOptions  
  ) => AnimationThenType
  next: () => void
  start: () => void
  pause: () => void
  stop: () => void
  timer: AnimationTimerType
}

const OPTIONS_DEFAULT: AnimationOptions = {
  label: '',
  duration: 3000, // ms
  refreshRate: 40, // ms
  timeFunction: linear
}

export default function Animator(): AnimatorType {
  var animation: AnimationType | null = null 
  const animationTimer: AnimationTimerType = AnimationTimer()
  const queue: QueueType<AnimationType> = Queue<AnimationType>()

  const next = () => {
    if (queue.peek()) {
      animationTimer.stop()
      animation = queue.dequeue() || null
      _execute()
    }
  }
  
  const _execute = () => {
    if (animation && animationTimer.playingState !== 'playing') {
      animationTimer.start((timerState: AnimationTimerState) => {
        let progressTime = (
          (performance.now() - timerState.startTime) % animation!.options.duration!
          ) / animation!.options.duration!
        const progress = animation!.options.timeFunction!(progressTime)
        const progressDelta = animation!.options.timeFunction!(performance.now() - timerState.startTime)
        animation!.callback({ progress, progressDelta, next: next, stop: stop })
      }, animation!.options.refreshRate!)
    }
  }

  const start = () => {
    if (animation) {
      _execute()
    } else {
      next()
    }
  }

  const pause = () => {
    animationTimer.pause()
  }

  const stop = () => {
    animationTimer.stop()
    queue.clear()
  }

  const addAnimation = (
    callback: AnimateCallback,
    options: AnimationOptions = {}
  ) => {
    options = Object.assign(OPTIONS_DEFAULT, options)
    queue.enqueue({ callback, options })
    return {
      then: addAnimation,
      stop: stop
    }
  }

  const setAnimation = (
    callback: AnimateCallback,
    options: AnimationOptions = {}
  ) => {
    options = Object.assign(OPTIONS_DEFAULT, options)
    queue.clear()
    queue.enqueue({ callback, options })
    return {
      then: addAnimation,
      stop: stop
    }
  }

  return {
    add: addAnimation,
    set: setAnimation,
    next,
    start,
    pause,
    stop,
    timer: animationTimer
  }
}