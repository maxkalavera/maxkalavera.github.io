import anime from 'animejs';

import type { AnimeInstance } from 'animejs';

function fadeIn (targets: string, duration=3000) {
  const output: {
    anime: null | AnimeInstance,
    promise: null | Promise<any>,
  } = {
    anime: null,
    promise: null,
  };

  output.promise = new Promise<void>((resolve, _) => {
    output.anime = anime({
      targets,
      duration: duration,
      easing: 'easeInOutSine',
      opacity: ['0.0', '1.0'],
      complete: () => resolve()
    });
  })

  return output;
};

export default fadeIn;