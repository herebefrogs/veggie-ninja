import rand from './util';
import { gamepad, gamepadConnected, gamepadDisconnected, gamepadPollData } from './gamepad';

document.title = "Veggie Ninja";

// global variables
const ATTACK_SPEED_MULTIPLIER = 3;
const ATTACK_MAX_TIME = 5; // maximum duration in seconds ninja can sustain attack mode
const ATTACK_REFILL_MULTIPLIER = 0.3; // speed factor at which ninja attack time gauge refills
const FRAME_INTERVAL = 0.1; // animation interval in seconds
const END_GAME_DELAY = 2000; // delay before ending game in milliseconds
const LEVEL_TIME = 60; // duration of a game level in seconds
const HEIGHT = 300;
const WIDTH = 400;
const CHARSET_SIZE = 8; // width & height in pixel of each letter in charset image
const atlas = {
  eggplant: {
    dead: {
      left: [ { x: 64, y: 144, w: 16, h: 18 } ]
    },
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
    dead: {
      left: [ { x: 64, y: 144, w: 16, h: 18 } ]
    },
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
    dead: {
      left: [ { x: 64, y: 144, w: 16, h: 18 } ],
      down: [ { x: 64, y: 144, w: 16, h: 18 } ],
      right: [ { x: 64, y: 144, w: 16, h: 18 } ],
      up: [ { x: 64, y: 144, w: 16, h: 18 } ]
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
    dead: {
      left: [ { x: 64, y: 144, w: 16, h: 18 } ],
    },
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
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789.:!-%';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const buffer = document.createElement('canvas');
const buffer_ctx = buffer.getContext('2d');
let charset = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAAICAYAAACbO2brAAAB5klEQVR42uVa2YrDMAw07Fvf9v8/tqWwhTZY18zI9tJAWlLHiqJjPHI1fm8/d/Qcf4c3js6t6JAdUz0T1eeqR1WX2RxLTsY3nh7s/BPP7DspZGbsw+iS0bUSi6gt0Pcf4oOR7+bX88M6Xjd1jL87cNXzo2vF8yP5M4DMzp9dWzaM7HsNCPX8Dv/svq7YSGXfyng2NqJ7Mr5Vvb8SIBHZr3mWPUc1gLsB5P33bwRIhf3+6/gOgNs1v0IQojzxYgPJrysDVfqPAUmPHXoAmWHY5kLR4WDPAYoEt+RbhsisgDM5MwMrAJQByJMZWHeCIfMzMVqNj4h9VfMnC4CI/hkZWYC24r9iX5bpWfMigIwYrJmnqxlEJ4NEACwCSFS+l0AewF+/T2VAEYBUFjJFfFl2VJSAlg8rDBBlcSiAov7PgoiVH0j8ZBgiM474F2IwihK1k0Eie3irtxgY+yifn9njUpSI0QrP7nGx9mf1W72FU8kDRfwp7OPlsYIhsiW2t+iPXQ5mAvyEAGZLLBQgmT9pvH/Su/bY0BKoAyAt+50M4Ih9WYas8F9Fv26ArJbuHxUI0+aws82nugnLtHFU2xtWtqlU2zSybRJM6wjS5sG0kTD+725z6Y6FqI1I1YbTPd5ZYmfbg2ZyHuewlwnHUW0vAAAAAElFTkSuQmCC';
let currentTime;
let activeEntities;
let deadEntities;
let ninja;
let lastTime;
let remainingTime;
let requestId;
let running;
let tileset = 'data:image/png;base64,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';
let timeoutId;
let score;

// implicit window.
addEventListener('load', init);

// global functions

// copy backbuffer onto visible canvas, scaling it to screen dimensions
function blit() {
  ctx.drawImage(
    buffer,
    0, 0, buffer.width, buffer.height,
    0, 0, canvas.width, canvas.height
  );
};

function changeVisibility(e) {
  // event target is document object
  if (e.target.hidden && gamepad) {
    // ¯\_(ツ)_/¯ Chrome also stop sending data for the cached gamepad after changing tab
    // so clear the cached gamepad
    gamepadDisconnected({ gamepad: { index: gamepad.index, connected: false }});
  }

  toggleLoop(!event.target.hidden);
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
  const sprite = getSprite('ninja', 'idle', 'right');
  return {
    action: 'idle',
    attackTime: ATTACK_MAX_TIME,
    dead: false,
    direction: 'right',
    frame: 0,
    lastFrame: 0,
    lastDead: 0,
    moveDown: 0,
    moveLeft: 0,
    moveRight: 0,
    moveUp: 0,
    speed: 100, // px/sec
    type: 'ninja',
    x: (WIDTH - sprite.w) / 2,
    y: (HEIGHT - sprite.h) / 2
  }
};

function createVeggie(type = 'eggplant') {
  const sprite = getSprite(type, 'move', 'left', 0);
  let x = 0;
  let y = 0;
  switch (rand(0, 3)) {
    case 0:
      x = rand(0, WIDTH - sprite.w);
      break;
    case 1:
      x = WIDTH - sprite.w;
      y = rand(0, HEIGHT - sprite.h);
      break;
    case 2:
      x = rand(0, WIDTH - sprite.w);
      y = HEIGHT - sprite.h;
      break;
    case 3:
      y = rand(0, HEIGHT - sprite.h);
      break;
  }
  return {
    action: 'move',
    dead: false,
    direction: 'left', // never changes
    frame: 0,
    lastFrame: 0,
    lastDead: 0,
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

function getEntitySprite(entity) {
  const sprite = atlas[entity.type][entity.action][entity.direction];
  return (entity.action !== 'idle') ? sprite[entity.frame] : sprite;
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

  // load assets
  loadTileset(tileset)
  .then(function(img) { tileset = img; })
  .then(function() { return loadTileset(charset); })
  .then(function(img) { charset = img; })
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

  // P
  if (keyEvent.which === 80) {
    toggleLoop(!running);
  }
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
  activeEntities = [ ninja ];
  deadEntities = [];
  timeoutId = undefined;
  remainingTime = LEVEL_TIME;
  score = 0;

  spawnVeggie();

  toggleLoop(true);
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

function render() {
  // clear buffer
  buffer_ctx.fillStyle = "#FFFFFF";
  buffer_ctx.fillRect(0, 0, buffer.width, buffer.height);

  // render background and dead entities
  for (let entity of deadEntities) {
    renderEntity(entity);
  }

  // render active entities
  for (let entity of activeEntities) {
    renderEntity(entity);
  }

  renderGameTimeLeft(remainingTime);
  renderAttackTimeLeft(ninja.attackTime);
  // score
  renderText(`score:${score}`, CHARSET_SIZE, CHARSET_SIZE);
  blit();
};

function renderAttackTimeLeft(time) {
  time = `${Math.ceil(time * 10)}`;
  const msg = `attack:${time / 10}${time[time.length - 1] === '0' ? '.0': ''}s`
  // number of characters times character width plus 1 pixel for spacing
  renderText(msg, Math.round((WIDTH - msg.length * (CHARSET_SIZE + 1)) / 2), CHARSET_SIZE);
};

// render an entity onto the backbuffer at 1:1 scale
function renderEntity(entity) {
  const sprite = getEntitySprite(entity);
  buffer_ctx.drawImage(
    tileset,
    sprite.x, sprite.y, sprite.w, sprite.h,
    Math.round(entity.x), Math.round(entity.y), sprite.w, sprite.h
  );
};

function renderGameTimeLeft(time) {
  const msg = `0:${time <= 9 ? '0' : ''}${Math.ceil(time)}`;
  // number of characters times character width plus 1 pixel for spacing, plus padding of 1 character width
  renderText(msg, WIDTH - msg.length * (CHARSET_SIZE + 1) - CHARSET_SIZE, CHARSET_SIZE);
};

function renderText(text, x, y) {
  for (let i = 0; i < text.length; i++) {
    buffer_ctx.drawImage(
      charset,
      // TODO could memoize the characters index or hardcode a lookup table
      alphabet.indexOf(text[i])*CHARSET_SIZE, 0, CHARSET_SIZE, CHARSET_SIZE,
      x + i*(CHARSET_SIZE + 1), y, CHARSET_SIZE, CHARSET_SIZE
    );
  }
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
function setNinjaActionAndDirection(entity) {
  const leftOrRight = entity.moveLeft + entity.moveRight;
  const upOrDown = entity.moveUp + entity.moveDown;

  entity.action = upOrDown === 0 && leftOrRight === 0 ? 'idle' : (entity.attack && entity.attackTime ? 'attack' : 'move');

  entity.direction = upOrDown < 0 ? 'up' : (upOrDown > 0 ? 'down' : entity.direction);
  entity.direction = leftOrRight < 0 ? 'left' : (leftOrRight > 0 ? 'right' : entity.direction);
};

function setNinjaAttackTime(entity, elapsedTime) {
  entity.attackTime = Math.max(
    0,
    Math.min(
      ATTACK_MAX_TIME,
      entity.attackTime + (entity.attack ? -elapsedTime : elapsedTime * ATTACK_REFILL_MULTIPLIER)
    )
  );
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
  if (!entity.dead) {
    const distance = entity.speed * elapsedTime * (entity.action === 'attack' ? ATTACK_SPEED_MULTIPLIER : 1);
    entity.x += distance * (entity.moveLeft + entity.moveRight);
    entity.y += distance * (entity.moveUp + entity.moveDown);
  }
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

function spawnVeggie() {
  let type = [ 'eggplant', 'garlic', 'radish' ][rand(0, 2)];
  activeEntities.push(createVeggie(type));
};

function toggleLoop(value) {
  running = value;
  if (running) {
    lastTime = Date.now();
    loop();
  } else {
    cancelAnimationFrame(requestId);
  }
};

function unloadGame() {
  // implicit window.
  removeEventListener('keydown', keyPressed);
  removeEventListener('keyup', keyReleased);
  removeEventListener('gamepadconnected', gamepadConnected);
  removeEventListener('gamepaddisconnected', gamepadDisconnected);
  document.removeEventListener('visibilitychange', changeVisibility);

  toggleLoop(false);
};

function update(elapsedTime) {
  if (!ninja.dead && remainingTime > 0) {

    // TODO extract that into a function
    const gamepadData = gamepadPollData();
    if (gamepadData) {
      // once connected, gamepad overrides keyboard inputs
      if (gamepadData.leftX <= 0) {
        // TODO maybe this would be simpler if moveLeft & moveRight
        // were merged into a single value [-1, 1]
        ninja.moveLeft = gamepadData.leftX;
        ninja.moveRight = 0;
      } else {
        ninja.moveLeft = 0;
        ninja.moveRight = gamepadData.leftX;
      }
      if (gamepadData.leftY <= 0) {
        ninja.moveUp = gamepadData.leftY;
        ninja.moveDown = 0;
      } else {
        ninja.moveUp = 0;
        ninja.moveDown = gamepadData.leftY;
      }
      // ninja attack if any button is pressed
      ninja.attack = gamepadData.buttonA || gamepadData.buttonB ||
                     gamepadData.buttonX || gamepadData.buttonY;
    }

    // collision test between ninja and all the veggies's previous positions
    const ninjaSprite = getEntitySprite(ninja);
    for (let entity of activeEntities) {
      if (entity === ninja || entity.dead) continue;

      // TODO abstract in a function
      const entitySprite = getEntitySprite(entity);
      // AABB collision test
      // TODO use bounding box rather than sprite size
      if (ninja.x < entity.x + entitySprite.w &&
          ninja.x + ninjaSprite.w > entity.x &&
          ninja.y < entity.y + entitySprite.h &&
          ninja.y + ninjaSprite.h > entity.y) {
        // collision!
        if (ninja.action === 'attack') {
          entity.action = 'dead';
          entity.dead = true;
          // TODO messy
          entity.frame = 0;
        } else {
          ninja.action = 'dead';
          ninja.dead = true;
          // TODO messy
          ninja.frame = 0;
        }
      }
    }

    // update the state of the ninja and all the veggies
    for (let [index, entity] of activeEntities.entries()) {
      if (entity.dead) {
        updateScore(entity, index);
        continue;
      } else if (entity === ninja) {
        setNinjaAttackTime(entity, elapsedTime);
        setNinjaActionAndDirection(entity);
      } else if (entity.frame === 0) {
        setVeggieDirection(entity, ninja);
      }
      setEntityFrame(entity, elapsedTime);
      setEntityPosition(entity, elapsedTime);
      constrainEntityToViewport(entity);
    }

    // TODO for now, until I figure out how/when new veggies appears
    if (activeEntities.length < 2 && !ninja.dead) {
      spawnVeggie();
    }

    remainingTime -= elapsedTime;
  } else {
    if (!timeoutId) {
      // TODO for now, until end screen
      timeoutId = setTimeout(function() {
        unloadGame();
        loadGame();
      }, END_GAME_DELAY);
    }

    // until end screen appears
    for (let entity of activeEntities) {
      if (entity !== ninja) {
        if (entity.frame === 0) {
          setVeggieDirection(entity, ninja);
        }
        // if the veggie ninja is dead, veggies keep closing on him
        // if time runs out, everybody animates in place
        if (ninja.dead) {
          setEntityPosition(entity, elapsedTime);
        }
      }
      // animate entities a bit longer until end screen appears
      setEntityFrame(entity, elapsedTime);
    }
  }
};

function updateScore(entity, index) {
  activeEntities.splice(index, 1);
  deadEntities.push(entity);
  if (entity !== ninja) {
    score += 1;
  }
};
