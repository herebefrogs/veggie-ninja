// wrap global variables/functions into in IIFE so uglify will rename them
(function() {
  document.title = "Veggie Ninja";

  // global variables
  const ATTACK_SPEED_MULTIPLIER = 3;
  const FRAME_INTERVAL = 0.1; // animation interval in seconds
  const LEFT_ANALOG_X_AXIS = 0; // very specific to Afterglow Xbox Controller
  const LEFT_ANALOG_Y_AXIS = 1;
  const BUTTON_A = 0;
  const BUTTON_B = 1;
  const BUTTON_X = 2;
  const BUTTON_Y = 3;
  const HEIGHT = 300;
  const WIDTH = 400;
  const atlas = {
    eggplant: {
      move: {
        left: [
          { x: 0, y: 72, w: 16, h: 18 },
          { x: 16, y: 72, w: 16, h: 18 },
          { x: 32, y: 72, w: 16, h: 18 },
          { x: 48, y: 72, w: 16, h: 18 },
          { x: 64, y: 72, w: 16, h: 18 }
        ]
      }
    },
    garlic: {
      move: {
        left: [
          { x: 0, y: 108, w: 16, h: 18 },
          { x: 16, y: 108, w: 16, h: 18 },
          { x: 32, y: 108, w: 16, h: 18 },
          { x: 48, y: 108, w: 16, h: 18 },
          { x: 64, y: 108, w: 16, h: 18 }
        ]
      }
    },
    ninja: {
      attack: {
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
      },
      idle: {
        left: { x: 0, y: 0, w: 16, h: 18 },
        down: { x: 0, y: 18, w: 16, h: 18 },
        right: { x: 0, y: 36, w: 16, h: 18 },
        up: { x: 0, y: 54, w: 16, h: 18 }
      },
      move: {
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
    radish: {
      move: {
        left: [
          { x: 0, y: 90, w: 16, h: 18 },
          { x: 16, y: 90, w: 16, h: 18 },
          { x: 32, y: 90, w: 16, h: 18 },
          { x: 48, y: 90, w: 16, h: 18 },
          { x: 64, y: 90, w: 16, h: 18 }
        ]
      }
    }
  };
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const buffer = document.createElement('canvas');
  const buffer_ctx = buffer.getContext('2d');
  let currentTime;
  let entities;
  let gamepad;
  let ninja;
  let lastTime;
  let requestId;
  let running;
  let tileset = 'data:image/png;base64,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';

  // implicit window.
  addEventListener('load', init);

  // global functions

  // copy backbuffer onto visible canvas, scaling it to screen dimensions
  function blit() {
    ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height,
                          0, 0, canvas.width, canvas.height);
  };

  function changeVisibility(e) {
    // event target is document object
    if (e.target.hidden) {
      // ¯\_(ツ)_/¯ Chrome also stop sending data for the cached gamepad after changing tab
      // so clear the cached gamepad
      gamepadDisconnected({ gamepad: { index: gamepad.index, connected: false }});
    }

    running = !event.target.hidden;
    if (running) {
      // skip all the missed time to avoid a huge leap forward
      lastTime = Date.now();
      // restart the game animation loop
      loop();
    }
  };

  function constrainEntityToViewport(entity) {
    const sprite = getEntitySprite(entity);
    if (entity.x <= 0) {
      entity.x = 0;
    } else if (entity.x + sprite.w >= WIDTH) {
      entity.x = WIDTH - sprite.w;
    }
    // skip one tile vertically for score
    if (entity.y <= 0) {
      entity.y = 0;
    } else if (entity.y >= HEIGHT - sprite.h) {
      entity.y = HEIGHT - sprite.h;
    }
  };

  function createNinja() {
    return {
      action: 'idle',
      direction: 'right',
      frame: 0,
      lastFrame: 0,
      moveDown: 0,
      moveLeft: 0,
      moveRight: 0,
      moveUp: 0,
      speed: 100, // px/sec
      type: 'ninja',
      x: 0,
      y: 0
    }
  };

  function createVeggie(type = 'eggplant') {
    let sprite = getSprite(type, 'move', 'left', 0);
    let x = 0;
    let y = 0;
    switch (randomInt(0, 3)) {
      case 0:
        x = randomInt(0, WIDTH - sprite.w);
        break;
      case 1:
        x = WIDTH - sprite.w;
        y = randomInt(0, HEIGHT - sprite.h);
        break;
      case 2:
        x = randomInt(0, WIDTH - sprite.w);
        y = HEIGHT - sprite.h;
        break;
      case 3:
        y = randomInt(0, HEIGHT - sprite.h);
        break;
    }
    return {
      action: 'move',
      direction: 'left', // never changes
      frame: 0,
      lastFrame: 0,
      moveDown: 0,
      moveLeft: 0,
      moveRight: 0,
      moveUp: 0,
      speed: 60, // px/sec
      type,
      x,
      y
    }
  };

  function gamepadConnected(e, gamepads) {
    if ((gamepads || navigator.getGamepads())[e.gamepad.index] && e.gamepad.connected) {
      console.log('connecting', e.gamepad);
      gamepad = e.gamepad;
    } else {
      // ¯\_(ツ)_/¯ Chrome fires a gamepadconnected event in lieu of
      // a gamepaddisconnected one, with connected set to true nonetheless
      // so force the gamepad disconnection
      gamepadDisconnected({ gamepad: { index: e.gamepad.index, connected: false }});
    }
  }

  function gamepadDisconnected(e) {
    if (gamepad && gamepad.index === e.gamepad.index && !e.gamepad.connected) {
      console.log('disconnecting', gamepad);
      gamepad = undefined;
    }
  };

  function getEntitySprite(entity) {
    const sprite = atlas[entity.type][entity.action][entity.direction];
    return (entity.action === 'move') ? sprite[entity.frame] : sprite;
  };

  function getSprite(type, action, direction, frame) {
    return getEntitySprite({ action, direction, frame, type });
  };

  function init() {
    // implicit window.
    addEventListener('resize', resize);

    // set back buffer canvas size
    buffer.width = WIDTH;
    buffer.height = HEIGHT;
    // scale to fit visible canvas
    resize();

    // turn off gamepad polling if Gamepad API not supported
    if (!navigator.getGamepads) {
      pollGamepadData = function() {};
    }

    // load assets
    loadTileset(tileset)
    .then(function(img) {
      tileset = img;
    })
    // start game
    .then(loadGame);
  };

  function keyPressed(keyEvent) {
    // Space
    if (keyEvent.which === 32) {
      ninja.attack = true;
    }
    // Left arrow / A / Q
    if (keyEvent.which === 37 || keyEvent.which === 65 ||keyEvent.which === 81) { ninja.moveLeft = -1; }
    // Up arrow / W / Z
    if (keyEvent.which === 38 || keyEvent.which === 90 || keyEvent.which === 87) { ninja.moveUp = -1; }
    // Right arrow / D
    if (keyEvent.which === 39 || keyEvent.which === 68) { ninja.moveRight = 1; }
    // Down arrow / S
    if (keyEvent.which === 40 || keyEvent.which === 83) { ninja.moveDown = 1; }
  };

  function keyReleased(keyEvent) {
    // Space
    if (keyEvent.which === 32) {
      ninja.attack = false;
    }
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
    addEventListener('gamepadconnected', gamepadConnected);
    addEventListener('gamepaddisconnected', gamepadDisconnected);
    document.addEventListener('visibilitychange', changeVisibility);

    ninja = createNinja();
    entities = [ ninja ];

    let type = [ 'eggplant', 'garlic', 'radish' ][randomInt(0, 2)];
    entities.push(createVeggie(type));

    running = true;
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
    if (running) {
      requestId = requestAnimationFrame(loop);
      render();
      currentTime = Date.now();
      update((currentTime - lastTime) / 1000);
      lastTime = currentTime;
    }
  };

  function pollGamepadData() {
    const controllers = navigator.getGamepads();
    // ¯\_(ツ)_/¯ Chrome doesn't fire the gamepadconnected event when attaching a gamepad
    // so pick the first connected gamepad of the list
    if (!gamepad) {
      for (let controller of controllers) {
        if (controller && controller.connected) {
          gamepadConnected({ gamepad: controller }, controllers);
          break;
        }
      }
    }
    if (gamepad) {
      // ninja attack if any button is pressed
      ninja.attack = gamepad.buttons[BUTTON_A].pressed ||
                     gamepad.buttons[BUTTON_B].pressed ||
                     gamepad.buttons[BUTTON_X].pressed ||
                     gamepad.buttons[BUTTON_Y].pressed;

      // once connected, gamepad takes precedence over keyboard arrows
      let left_x = Math.round(gamepad.axes[LEFT_ANALOG_X_AXIS] * 100) / 100;
      if (left_x <= 0) {
        ninja.moveLeft = left_x;
        ninja.moveRight = 0;
      } else {
        ninja.moveLeft = 0;
        ninja.moveRight = left_x;
      }
      let left_y = Math.round(gamepad.axes[LEFT_ANALOG_Y_AXIS] * 100) / 100;
      if (left_y <= 0) {
        ninja.moveUp = left_y;
        ninja.moveDown = 0;
      } else {
        ninja.moveUp = 0;
        ninja.moveDown = left_y;
      }
    }
  };

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  function render() {
    buffer_ctx.fillStyle = "#FFFFFF";
    buffer_ctx.fillRect(0, 0, buffer.width, buffer.height);

    for (let entity of entities) {
      renderEntity(entity);
    }

    blit();
  };

  // render an entity onto the backbuffer at 1:1 scale
  function renderEntity(entity) {
    const sprite = getEntitySprite(entity);
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

  // currently only useful for ninja, as veggies always move
  // and currently have only 1 animation regardless of direction
  function setEntityActionAndDirection(entity) {
    const leftOrRight = entity.moveLeft + entity.moveRight;
    const upOrDown = entity.moveUp + entity.moveDown;

    entity.action = upOrDown === 0 && leftOrRight === 0 ? 'idle' : entity.attach ? 'attack' : 'move';

    entity.direction = upOrDown < 0 ? 'up' : (upOrDown > 0 ? 'down' : entity.direction);
    entity.direction = leftOrRight < 0 ? 'left' : (leftOrRight > 0 ? 'right' : entity.direction);
  };

  function setEntityFrame(entity, elapsedTime) {
    if (entity.action !== 'idle') {
      entity.lastFrame += elapsedTime;
      if (entity.lastFrame > FRAME_INTERVAL) {
        entity.lastFrame -= FRAME_INTERVAL;
        entity.frame = (entity.frame + 1) % atlas[entity.type][entity.action][entity.direction].length;
      }
    }
  };

  function setEntityPosition(entity, elapsedTime) {
    const distance = entity.speed * elapsedTime * (entity.attack ? ATTACK_SPEED_MULTIPLIER : 1);
    entity.x += distance * (entity.moveLeft + entity.moveRight);
    entity.y += distance * (entity.moveUp + entity.moveDown);
  };

  function setVeggieDirection(veggie, ninja) {
    veggie.moveLeft = veggie.moveRight = veggie.moveUp = veggie.moveDown = 0;

    const dX = ninja.x - veggie.x;
    const dY = ninja.y - veggie.y;
    const d = Math.sqrt(dX * dX + dY * dY);
    if (d !== 0) {
      const vX = dX / d;
      const vY = dY / d;
      veggie[vX >= 0 ? 'moveRight' : 'moveLeft'] = vX;
      veggie[vY >= 0 ? 'moveDown' : 'moveUp'] = vY;
    }
  }

  function update(elapsedTime) {
    pollGamepadData();

    for (let entity of entities) {
      if (entity === ninja) {
        setEntityActionAndDirection(entity);
      } else if (entity.frame === 0) {
        setVeggieDirection(entity, ninja);
      }
      setEntityFrame(entity, elapsedTime);
      setEntityPosition(entity, elapsedTime);
      constrainEntityToViewport(entity);
    }
  };
})();
