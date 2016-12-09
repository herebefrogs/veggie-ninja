// wrap global variables/functions into in IIFE so uglify will rename them
(function() {
  document.title = "Veggie Ninja";

  // global variables
  const WIDTH = 400;
  const HEIGHT = 300;
  const atlas = {
    ninja: {
      idle: {
        left: { x: 0, y: 0, w: 16, h: 18 },
        down: { x: 0, y: 18, w: 16, h: 18 },
        right: { x: 0, y: 36, w: 16, h: 18 },
        up: { x: 0, y: 54, w: 16, h: 18 }
      },
      walk: {
        left: [
          { x: 16, y: 0, w: 16, h: 18 },
          { x: 32, y: 0, w: 16, h: 18 },
          { x: 48, y: 0, w: 16, h: 18 },
          { x: 64, y: 0, w: 16, h: 18 }
        ],
        down: [
          { x: 16, y: 18, w: 16, h: 18 },
          { x: 32, y: 18, w: 16, h: 18 },
          { x: 48, y: 18, w: 16, h: 18 },
          { x: 64, y: 18, w: 16, h: 18 }
        ],
        right: [
          { x: 16, y: 36, w: 16, h: 18 },
          { x: 32, y: 36, w: 16, h: 18 },
          { x: 48, y: 36, w: 16, h: 18 },
          { x: 64, y: 36, w: 16, h: 18 }
        ],
        up: [
          { x: 16, y: 54, w: 16, h: 18 },
          { x: 32, y: 54, w: 16, h: 18 },
          { x: 48, y: 54, w: 16, h: 18 },
          { x: 64, y: 54, w: 16, h: 18 }
        ]
      }
    },
  };
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const buffer = document.createElement('canvas');
  const buffer_ctx = buffer.getContext('2d');
  let currentTime;
  let ninja;
  let lastTime;
  let requestId;
  let tileset = 'data:image/png;base64,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';

  // implicit window.
  addEventListener('load', init);

  // global functions

  // copy backbuffer onto visible canvas, scaling it to screen dimensions
  function blit() {
    ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height,
                          0, 0, canvas.width, canvas.height);
  }

  function createNinja() {
    return {
      action: 'idle',
      direction: 'right',
      sprites: atlas.ninja,
      x: 0,
      y: 0
    }

  };

  function init() {
    // implicit window.
    addEventListener('resize', resize);

    // set back buffer canvas size
    buffer.width = WIDTH;
    buffer.height = HEIGHT;
    // scale to fit visible canvas
    resize();

    // load assets
    loadTileset(tileset)
    .then(function(img) {
      tileset = img;
    })
    // start game
    .then(loadGame);
  };

  function keyPressed(keyEvent) {
    // Left arrow / A / Q
    if (keyEvent.which === 37 || keyEvent.which === 65 ||keyEvent.which === 81) { ninja.moveLeft = 1; }
    // Up arrow / W / Z
    if (keyEvent.which === 38 || keyEvent.which === 90 || keyEvent.which === 87) { ninja.moveUp = 1; }
    // Right arrow / D
    if (keyEvent.which === 39 || keyEvent.which === 68) { ninja.moveRight = 1; }
    // Down arrow / S
    if (keyEvent.which === 40 || keyEvent.which === 83) { ninja.moveDown = 1; }
  };

  function keyReleased(keyEvent) {
    // Left arrow / A / Q
    if (keyEvent.which === 37 || keyEvent.which === 65 || keyEvent.which === 81) { ninja.moveLeft = 0; }
    // Up arrow / W / Z
    if (keyEvent.which === 38 || keyEvent.which === 90 || keyEvent.which === 87) { ninja.moveUp = 0; }
    // Right arrow / D
    if (keyEvent.which === 39 || keyEvent.which === 68) { ninja.moveRight = 0; }
    // Down arrow / S
    if (keyEvent.which === 40 || keyEvent.which === 83) { ninja.moveDown = 0; }
  };

  function loadGame() {
    // implicit window.
    addEventListener('keydown', keyPressed);
    addEventListener('keyup', keyReleased);

    ninja = createNinja();

    lastTime = Date.now();
    loop();
  };

  function loadTileset(tileset) {
    return new Promise(function(resolve) {
      var img = new Image();
      img.addEventListener('load', function() {
        resolve(img);
      })
      img.src = tileset;
    });
  };

  function loop() {
    requestId = requestAnimationFrame(loop);
    render();
    currentTime = Date.now();
    update((currentTime - lastTime) / 1000);
    lastTime = currentTime;
  };

  function render() {
    buffer_ctx.fillStyle = "#FFFFFF";
    buffer_ctx.fillRect(0, 0, buffer.width, buffer.height);

    renderEntity(ninja);

    blit();
  };

  // render an entity onto the backbuffer at 1:1 scale
  function renderEntity(entity) {
    let sprite = entity.sprites[entity.action][entity.direction];
    buffer_ctx.drawImage(tileset, sprite.x, sprite.y, sprite.w, sprite.h,
                                  entity.x, entity.y, sprite.w, sprite.h);
  };

  function resize() {
    // implicit window.
    const scaleToFit = Math.min(innerWidth / WIDTH, innerHeight / HEIGHT);
    canvas.width = WIDTH * scaleToFit;
    canvas.height = HEIGHT * scaleToFit;

    // disable smoothing on scaling
    buffer_ctx.mozImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
    buffer_ctx.msImageSmoothingEnabled = ctx.msImageSmoothingEnabled = false;
    buffer_ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
  };

  function update(elapsedTime) {
    console.log('update', elapsedTime, ninja.moveLeft, ninja.moveUp, ninja.moveRight, ninja.moveDown);
  };
})();
