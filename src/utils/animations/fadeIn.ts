import anime from 'animejs';

function fadeIn (targets: string, duration=3000) {
  return new Promise<void>((resolve, _) => {
    anime({
      targets,
      duration: duration,
      easing: 'easeInOutSine',
      opacity: ['0.0', '1.0'],
      complete: () => resolve()
    });
  });
};

export default fadeIn;