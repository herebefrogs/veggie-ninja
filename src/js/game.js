// wrap global variables/functions into in IIFE so uglify will rename them
(function() {
  document.title = "Veggie Ninja";

  // global variables
  const WIDTH = 400;
  const HEIGHT = 300;
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  resize();

  // implicit window.
  addEventListener('load', init);
  addEventListener('resize', resize);

  // global functions
  function init() {

  }

  function resize() {
    const scaleToFit = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
    canvas.width = WIDTH * scaleToFit;
    canvas.height = HEIGHT * scaleToFit;

    // disable smoothing on scaling
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  };
})();
