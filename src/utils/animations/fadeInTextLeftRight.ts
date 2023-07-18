import anime from 'animejs';

import type { AnimeInstance } from 'animejs';

function fadeInTextLeftRight (id_: string, text: string, duration=2000) {
  const output: {
    anime: null | AnimeInstance,
    promise: null | Promise<any>,
  } = {
    anime: null,
    promise: null,
  };

  output.promise = new Promise<void>((resolve, reject) => {
    const element = document.getElementById(id_);
    if (element === null) return reject();

    output.anime = anime({
      duration: duration,
      easing: 'easeInOutSine',
      update: (state) => {
        const index = Math.floor(text.length * (state.progress / 100));
        element.textContent = text.slice(0, index);
      },
      begin: () => {
        element.textContent = '';
        element.setAttribute('contenteditable', 'true');
        element.focus();
      },
      complete: () => {
        element.setAttribute('contenteditable', 'false');
        resolve();
      }
    });
  });

  return output;
};

export default fadeInTextLeftRight;