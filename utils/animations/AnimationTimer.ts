export interface AnimationTimerState {
  startTime: number
  timer: number
}

interface AnimationTimer {
  playingState: 'idle' | 'playing' | 'paused'
  start: (this: AnimationTimer, animationFunction: Function, refreshRate: number) => void
  stop:  () => void
  pause:  () => void
}

export default function AnimationTimer() {
  var state: AnimationTimerState = {  // Private properties
    startTime: 0,
    timer: 0,
  }
  return Object.create(
    {
      playingState: 'idle',
      start: function start(animationFunction, refreshRate) {
        state.startTime = performance.now()
        state.timer = setInterval(animationFunction, refreshRate, state)
        this.playingState = 'playing'
      },    
      stop: function stop() {
        clearInterval(state.timer)
        state.timer = 0
        state.startTime = 0
        this.playingState = 'idle'
      },    
      pause: function pause() {
        clearInterval(state.timer)
        state.timer = 0
        this.playingState = 'paused'
      }
    } as AnimationTimer
  )
}