import anime from 'animejs';

function fadeInTextLeftRight (id_: string, text: string, duration=2000) {
  const element = document.getElementById(id_);
  if (element === null) return;

  return new Promise<void>((resolve, _) => {
    anime({
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
};

export default fadeInTextLeftRight;