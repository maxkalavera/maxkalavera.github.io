

export default function throttle(
  callback: (...args: any[]) => any,
  {
    wait=1000/24,
    resetOnFinish=false
  }
) {
  let inThrottle = false;
  return function () {
      if (!inThrottle) {
          inThrottle = true;
          callback(...Array.from(arguments))
          if (resetOnFinish) inThrottle = false;
          setTimeout(() => {
            inThrottle = false;
          }, wait);
      }
  }
}