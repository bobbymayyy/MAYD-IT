const canvas = document.querySelector<HTMLCanvasElement>('#fragment');
if (!canvas) throw new Error('Fragment canvas not found');

const context = canvas.getContext('2d', { alpha: false });
if (!context) throw new Error('2D canvas context unavailable');
const ctx: CanvasRenderingContext2D = context;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const HALF_HEIGHT = HEIGHT / 2;
const FOV = Math.PI / 3;
const MAX_DEPTH = 18;
const RAY_STEP = 2;
const MOVE_SPEED = 2.75;
const TURN_SPEED = 2.15;
const MOUSE_SENSITIVITY = 0.0026;
const PLAYER_RADIUS = 0.18;
const ANOMALY_MIN_DISTANCE = 1.4;
const ANOMALY_MAX_DISTANCE = 12.5;
const ANOMALY_SCAN_RADIUS = 14;
const ANOMALY_DENSITY = 0.045;
const GLYPHS = '01<>/\\[]{};:+-*#%@';
const GAME_KEYS = new Set([
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyQ',
  'KeyE',
]);

const keys = new Set<string>();
const clearedAnomalies = new Set<string>();
let px = 0.5;
let py = 0.5;
let angle = 0;
let frontierAngle = 0;
let travelled = 0;
let hits = 0;
let shots = 0;
let shotFlash = 0;
let impactFlash = 0;
let mouseTurn = 0;
let lastTime = performance.now();

interface TouchControl {
  id: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  lastX: number;
  moved: boolean;
}

let moveTouch: TouchControl | null = null;
let lookTouch: TouchControl | null = null;

const normalizeAngle = (value: number) => {
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
};

const lerpAngle = (from: number, to: number, amount: number) =>
  from + normalizeAngle(to - from) * Math.min(1, amount);

const hash = (x: number, y: number, salt = 0) => {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(salt | 0, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967295;
};

const isSolid = (x: number, y: number) => {
  // Keep the spawn cell open so collision starts from valid geometry.
  if (x === 0 && y === 0) return false;
  const h = hash(x, y, 17);
  const rib = Math.abs((x * 3 + y * 5) % 13);
  return h < 0.235 || (rib === 0 && h < 0.56);
};

const isResolvedCell = (cellX: number, cellY: number) => {
  if (cellX === Math.floor(px) && cellY === Math.floor(py)) return false;
  const dx = cellX + 0.5 - px;
  const dy = cellY + 0.5 - py;
  const length = Math.hypot(dx, dy);
  if (length < 0.001) return false;
  const frontierDot = (dx * Math.cos(frontierAngle) + dy * Math.sin(frontierAngle)) / length;
  return frontierDot >= 0.08;
};

const canOccupy = (x: number, y: number) => {
  const samples = [
    [-PLAYER_RADIUS, -PLAYER_RADIUS],
    [0, -PLAYER_RADIUS],
    [PLAYER_RADIUS, -PLAYER_RADIUS],
    [-PLAYER_RADIUS, 0],
    [PLAYER_RADIUS, 0],
    [-PLAYER_RADIUS, PLAYER_RADIUS],
    [0, PLAYER_RADIUS],
    [PLAYER_RADIUS, PLAYER_RADIUS],
  ] as const;

  for (const [ox, oy] of samples) {
    const cellX = Math.floor(x + ox);
    const cellY = Math.floor(y + oy);
    if (isResolvedCell(cellX, cellY) && isSolid(cellX, cellY)) return false;
  }
  return true;
};

interface RayHit {
  distance: number;
  side: number;
  visible: boolean;
  hit: boolean;
}

function castRay(rayAngle: number): RayHit {
  const dx = Math.cos(rayAngle);
  const dy = Math.sin(rayAngle);
  const frontierDot = dx * Math.cos(frontierAngle) + dy * Math.sin(frontierAngle);

  if (frontierDot < 0.08) return { distance: MAX_DEPTH, side: 0, visible: false, hit: false };

  let mapX = Math.floor(px);
  let mapY = Math.floor(py);
  const deltaX = Math.abs(1 / (dx || 0.000001));
  const deltaY = Math.abs(1 / (dy || 0.000001));
  const stepX = dx < 0 ? -1 : 1;
  const stepY = dy < 0 ? -1 : 1;
  let sideX = dx < 0 ? (px - mapX) * deltaX : (mapX + 1 - px) * deltaX;
  let sideY = dy < 0 ? (py - mapY) * deltaY : (mapY + 1 - py) * deltaY;
  let side = 0;
  let distance = MAX_DEPTH;
  let didHit = false;

  for (let i = 0; i < 40; i += 1) {
    if (sideX < sideY) {
      sideX += deltaX;
      mapX += stepX;
      side = 0;
    } else {
      sideY += deltaY;
      mapY += stepY;
      side = 1;
    }

    const dxCell = mapX - Math.floor(px);
    const dyCell = mapY - Math.floor(py);
    if (dxCell * dxCell + dyCell * dyCell > MAX_DEPTH * MAX_DEPTH) break;

    if (isSolid(mapX, mapY)) {
      distance = side === 0
        ? (mapX - px + (1 - stepX) / 2) / dx
        : (mapY - py + (1 - stepY) / 2) / dy;
      didHit = true;
      break;
    }
  }

  return {
    distance: Math.max(0.1, Math.min(MAX_DEPTH, distance)),
    side,
    visible: true,
    hit: didHit,
  };
}

function renderFragments(time: number) {
  ctx.fillStyle = '#020702';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  ctx.textBaseline = 'top';

  const tick = Math.floor(time / 105);
  for (let gy = 0; gy < HEIGHT; gy += 12) {
    for (let gx = 0; gx < WIDTH; gx += 10) {
      const drift = tick + Math.floor(gx / 10) * 3;
      const chance = hash(gx, gy + drift * 4, tick >> 2);
      if (chance < 0.58) continue;
      const glyphIndex = Math.floor(hash(gx + drift, gy, 91) * GLYPHS.length) % GLYPHS.length;
      const alpha = 0.08 + hash(gx, gy, drift) * 0.28;
      ctx.fillStyle = `rgba(124,255,114,${alpha.toFixed(3)})`;
      ctx.fillText(GLYPHS[glyphIndex], gx, (gy + (drift % 12)) % HEIGHT);
    }
  }
}

function renderWorld() {
  const depthBuffer = new Float32Array(WIDTH);
  depthBuffer.fill(MAX_DEPTH + 1);

  for (let sx = 0; sx < WIDTH; sx += RAY_STEP) {
    const camera = sx / WIDTH - 0.5;
    const rayAngle = angle + camera * FOV;
    const hit = castRay(rayAngle);
    if (!hit.visible) continue;

    if (hit.hit) {
      for (let offset = 0; offset < RAY_STEP && sx + offset < WIDTH; offset += 1) {
        depthBuffer[sx + offset] = hit.distance;
      }
    }

    const projectedDistance = Math.max(0.1, hit.distance * Math.cos(rayAngle - angle));
    const wallHeight = Math.min(HEIGHT * 1.45, HEIGHT / projectedDistance * 1.12);
    const top = Math.floor(HALF_HEIGHT - wallHeight / 2);
    const bottom = Math.ceil(HALF_HEIGHT + wallHeight / 2);
    const depth = 1 - Math.min(1, hit.distance / MAX_DEPTH);
    const sideShade = hit.side ? 0.72 : 1;
    const alpha = Math.max(0.08, depth * 0.72 * sideShade);

    ctx.fillStyle = `rgba(2,7,2,${Math.min(0.92, 0.3 + depth * 0.62).toFixed(3)})`;
    ctx.fillRect(sx, 0, RAY_STEP, Math.max(0, top));
    ctx.fillRect(sx, bottom, RAY_STEP, HEIGHT - bottom);

    ctx.fillStyle = `rgba(124,255,114,${alpha.toFixed(3)})`;
    ctx.fillRect(sx, top, RAY_STEP, Math.max(1, bottom - top));

    if (((sx / RAY_STEP) & 3) === 0) {
      ctx.fillStyle = `rgba(223,255,119,${(alpha * 0.35).toFixed(3)})`;
      ctx.fillRect(sx, top, 1, Math.max(1, bottom - top));
    }

    const floorAlpha = Math.max(0.025, depth * 0.12);
    ctx.fillStyle = `rgba(124,255,114,${floorAlpha.toFixed(3)})`;
    ctx.fillRect(sx, HALF_HEIGHT, RAY_STEP, 1);
  }

  return depthBuffer;
}

interface Anomaly {
  id: string;
  screenX: number;
  size: number;
  distance: number;
}

function anomalies(): Anomaly[] {
  const result: Anomaly[] = [];
  const centerX = Math.floor(px);
  const centerY = Math.floor(py);

  for (let cellY = centerY - ANOMALY_SCAN_RADIUS; cellY <= centerY + ANOMALY_SCAN_RADIUS; cellY += 1) {
    for (let cellX = centerX - ANOMALY_SCAN_RADIUS; cellX <= centerX + ANOMALY_SCAN_RADIUS; cellX += 1) {
      const id = `${cellX}:${cellY}`;
      if (clearedAnomalies.has(id) || isSolid(cellX, cellY) || hash(cellX, cellY, 301) >= ANOMALY_DENSITY) continue;

      const anomalyX = cellX + 0.2 + hash(cellX, cellY, 777) * 0.6;
      const anomalyY = cellY + 0.2 + hash(cellX, cellY, 778) * 0.6;
      const dx = anomalyX - px;
      const dy = anomalyY - py;
      const distance = Math.hypot(dx, dy);
      if (distance < ANOMALY_MIN_DISTANCE || distance > ANOMALY_MAX_DISTANCE) continue;

      const anomalyAngle = Math.atan2(dy, dx);
      const relative = normalizeAngle(anomalyAngle - angle);
      if (Math.abs(relative) > FOV * 0.55) continue;
      if (Math.cos(anomalyAngle - frontierAngle) < 0.08) continue;

      // Raw ray distance is compared against raw target distance so walls truly occlude ERRs.
      const wall = castRay(anomalyAngle);
      if (!wall.visible || (wall.hit && wall.distance < distance - 0.08)) continue;

      const screenX = WIDTH * (0.5 + relative / FOV);
      const size = Math.max(7, Math.min(42, 92 / distance));
      result.push({ id, screenX, size, distance });
    }
  }

  return result;
}

function drawAnomaly(anomaly: Anomaly, y: number, pulse: number) {
  ctx.font = `700 ${Math.round(anomaly.size)}px ui-monospace, monospace`;
  ctx.fillStyle = `rgba(223,255,119,${pulse.toFixed(3)})`;
  ctx.fillText('◇', anomaly.screenX, y);
  ctx.font = `${Math.max(6, Math.round(anomaly.size * 0.26))}px ui-monospace, monospace`;
  ctx.fillText('ERR', anomaly.screenX, y + anomaly.size * 0.62);
}

function renderAnomalies(time: number, depthBuffer: Float32Array) {
  const pulse = 0.78 + Math.sin(time / 130) * 0.18;
  const current = anomalies().sort((a, b) => b.distance - a.distance);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const anomaly of current) {
    const y = HALF_HEIGHT + Math.sin(time / 250 + anomaly.distance) * 4;
    const left = Math.max(0, Math.floor(anomaly.screenX - anomaly.size * 0.7));
    const right = Math.min(WIDTH - 1, Math.ceil(anomaly.screenX + anomaly.size * 0.7));
    let runStart = -1;

    for (let x = left; x <= right + 1; x += 1) {
      const visible = x <= right && anomaly.distance < depthBuffer[x] - 0.04;
      if (visible && runStart < 0) runStart = x;
      if ((!visible || x > right) && runStart >= 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(runStart, 0, x - runStart, HEIGHT);
        ctx.clip();
        drawAnomaly(anomaly, y, pulse);
        ctx.restore();
        runStart = -1;
      }
    }
  }
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

function renderWeapon() {
  const cx = WIDTH / 2;
  const baseY = HEIGHT - 3;
  ctx.strokeStyle = shotFlash > 0 ? '#dfff77' : '#7cff72';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 34, baseY);
  ctx.lineTo(cx - 13, baseY - 27);
  ctx.lineTo(cx - 5, baseY - 31);
  ctx.lineTo(cx + 5, baseY - 31);
  ctx.lineTo(cx + 13, baseY - 27);
  ctx.lineTo(cx + 34, baseY);
  ctx.stroke();

  if (shotFlash > 0) {
    ctx.fillStyle = '#dfff77';
    ctx.beginPath();
    ctx.moveTo(cx, baseY - 34);
    ctx.lineTo(cx - 7, baseY - 48 - shotFlash * 10);
    ctx.lineTo(cx + 7, baseY - 48 - shotFlash * 10);
    ctx.closePath();
    ctx.fill();
  }
}

function renderHud() {
  const score = Math.floor(travelled * 10) + hits * 100;
  ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  ctx.fillStyle = '#8fa88f';
  ctx.fillText(`DEPTH ${travelled.toFixed(1).padStart(6, '0')}`, 8, 14);
  ctx.fillText(`PULSES ${shots.toString().padStart(3, '0')}`, 8, 26);
  ctx.fillStyle = '#dfff77';
  ctx.fillText(`SCORE ${score.toString().padStart(6, '0')}`, WIDTH - 92, 14);

  ctx.strokeStyle = '#dfff77';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 6, HALF_HEIGHT);
  ctx.lineTo(WIDTH / 2 - 2, HALF_HEIGHT);
  ctx.moveTo(WIDTH / 2 + 2, HALF_HEIGHT);
  ctx.lineTo(WIDTH / 2 + 6, HALF_HEIGHT);
  ctx.moveTo(WIDTH / 2, HALF_HEIGHT - 6);
  ctx.lineTo(WIDTH / 2, HALF_HEIGHT - 2);
  ctx.moveTo(WIDTH / 2, HALF_HEIGHT + 2);
  ctx.lineTo(WIDTH / 2, HALF_HEIGHT + 6);
  ctx.stroke();

  if (impactFlash > 0) {
    ctx.font = '12px ui-monospace, monospace';
    ctx.fillStyle = `rgba(223,255,119,${Math.min(1, impactFlash * 2).toFixed(3)})`;
    ctx.fillText('FRAGMENT CLEARED', WIDTH / 2 - 58, HALF_HEIGHT - 18);
  }

  if (moveTouch || lookTouch) {
    ctx.fillStyle = 'rgba(143,168,143,.55)';
    ctx.fillText('[ MOVE ]', 12, HEIGHT - 10);
    ctx.fillText('[ LOOK / FIRE ]', WIDTH - 96, HEIGHT - 10);
  }
}

function render(time: number) {
  renderFragments(time);
  const depthBuffer = renderWorld();
  renderAnomalies(time, depthBuffer);
  renderWeapon();
  renderHud();
}

function fire() {
  shots += 1;
  shotFlash = 1;

  const targets = anomalies();
  let best: Anomaly | null = null;
  for (const target of targets) {
    const aimError = Math.abs(target.screenX - WIDTH / 2);
    const hitRadius = Math.max(7, target.size * 0.52);
    if (aimError < hitRadius && (!best || target.distance < best.distance)) best = target;
  }

  if (best) {
    clearedAnomalies.add(best.id);
    hits += 1;
    impactFlash = 1;
    if ('vibrate' in navigator) navigator.vibrate(12);
  }
}

function update(dt: number) {
  // Mouse delta is accumulated independently so keyboard movement/fire never suppresses look input.
  angle += mouseTurn * MOUSE_SENSITIVITY;
  mouseTurn = 0;

  const turn = (keys.has('ArrowRight') || keys.has('KeyE') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyQ') ? 1 : 0);
  angle += turn * TURN_SPEED * dt;

  let forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
  let strafe = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0);

  if (moveTouch) {
    const dx = moveTouch.x - moveTouch.startX;
    const dy = moveTouch.y - moveTouch.startY;
    const radius = 48;
    strafe += Math.max(-1, Math.min(1, dx / radius));
    forward += Math.max(-1, Math.min(1, -dy / radius));
  }

  const magnitude = Math.hypot(forward, strafe);
  if (magnitude > 0.05) {
    const scale = magnitude > 1 ? 1 / magnitude : 1;
    forward *= scale;
    strafe *= scale;

    const moveX = Math.cos(angle) * forward + Math.cos(angle + Math.PI / 2) * strafe;
    const moveY = Math.sin(angle) * forward + Math.sin(angle + Math.PI / 2) * strafe;
    const stepX = moveX * MOVE_SPEED * dt;
    const stepY = moveY * MOVE_SPEED * dt;
    const oldX = px;
    const oldY = py;

    // Resolve axes separately so contact with a wall naturally slides along it.
    if (canOccupy(px + stepX, py)) px += stepX;
    if (canOccupy(px, py + stepY)) py += stepY;

    const actualX = px - oldX;
    const actualY = py - oldY;
    const distance = Math.hypot(actualX, actualY);
    if (distance > 0.0001) {
      travelled += distance;
      const movementAngle = Math.atan2(actualY, actualX);
      frontierAngle = lerpAngle(frontierAngle, movementAngle, dt * 2.35);
    }
  }

  shotFlash = Math.max(0, shotFlash - dt * 8.5);
  impactFlash = Math.max(0, impactFlash - dt * 2.8);
}

function frame(time: number) {
  const dt = Math.min(0.035, (time - lastTime) / 1000);
  lastTime = time;
  update(dt);
  render(time);
  requestAnimationFrame(frame);
}

canvas.tabIndex = 0;

window.addEventListener('keydown', (event) => {
  if (GAME_KEYS.has(event.code)) event.preventDefault();
  if (event.code === 'Space' && !event.repeat) fire();
  keys.add(event.code);
}, { capture: true });

window.addEventListener('keyup', (event) => {
  keys.delete(event.code);
}, { capture: true });

window.addEventListener('blur', () => {
  keys.clear();
  mouseTurn = 0;
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) keys.clear();
});

window.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === canvas) mouseTurn += event.movementX;
}, { capture: true });

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== canvas) mouseTurn = 0;
});

canvas.addEventListener('pointerdown', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (event.pointerType === 'mouse') {
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    if (document.pointerLockElement === canvas) fire();
    else void canvas.requestPointerLock();
    return;
  }

  canvas.setPointerCapture(event.pointerId);
  const touch: TouchControl = { id: event.pointerId, startX: x, startY: y, x, y, lastX: x, moved: false };
  if (x < rect.width / 2 && !moveTouch) moveTouch = touch;
  else if (!lookTouch) lookTouch = touch;
});

canvas.addEventListener('pointermove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (moveTouch?.id === event.pointerId) {
    moveTouch.x = x;
    moveTouch.y = y;
    moveTouch.moved ||= Math.hypot(x - moveTouch.startX, y - moveTouch.startY) > 8;
  }

  if (lookTouch?.id === event.pointerId) {
    const deltaX = x - lookTouch.lastX;
    lookTouch.x = x;
    lookTouch.y = y;
    lookTouch.moved ||= Math.hypot(x - lookTouch.startX, y - lookTouch.startY) > 8;
    angle += deltaX * 0.0065;
    lookTouch.lastX = x;
  }
});

function releasePointer(event: PointerEvent) {
  if (moveTouch?.id === event.pointerId) moveTouch = null;
  if (lookTouch?.id === event.pointerId) {
    if (!lookTouch.moved) fire();
    lookTouch = null;
  }
}

canvas.addEventListener('pointerup', releasePointer);
canvas.addEventListener('pointercancel', releasePointer);
canvas.addEventListener('contextmenu', (event) => event.preventDefault());

render(performance.now());
requestAnimationFrame(frame);
