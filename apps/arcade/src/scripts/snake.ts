const canvas = document.querySelector<HTMLCanvasElement>('#snake');
const scoreNode = document.querySelector<HTMLElement>('#score');

if (canvas && scoreNode) {
  const ctx = canvas.getContext('2d');
  const grid = 24;
  const cols = canvas.width / grid;
  const rows = canvas.height / grid;
  const swipeThreshold = 18;

  let snake: { x: number; y: number }[] = [];
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let turnQueued = false;
  let food = { x: 0, y: 0 };
  let score = 0;
  let dead = false;
  let pointerStart: { id: number; x: number; y: number } | null = null;

  const randomCell = () => ({ x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) });
  const spawnFood = () => {
    do food = randomCell(); while (snake.some((part) => part.x === food.x && part.y === food.y));
  };

  const reset = () => {
    snake = [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { ...dir };
    turnQueued = false;
    score = 0;
    dead = false;
    scoreNode.textContent = '0000';
    spawnFood();
  };

  const setDirection = (x: number, y: number) => {
    if (turnQueued || (dir.x + x === 0 && dir.y + y === 0)) return;
    nextDir = { x, y };
    turnQueued = true;
  };

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(key)) event.preventDefault();
    if (key === 'arrowup' || key === 'w') setDirection(0, -1);
    if (key === 'arrowdown' || key === 's') setDirection(0, 1);
    if (key === 'arrowleft' || key === 'a') setDirection(-1, 0);
    if (key === 'arrowright' || key === 'd') setDirection(1, 0);
    if (key === ' ' && dead) reset();
  });

  canvas.addEventListener('pointerdown', (event) => {
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener('pointerup', (event) => {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);

    if (dead && Math.hypot(dx, dy) < swipeThreshold) {
      reset();
      return;
    }
    if (Math.max(Math.abs(dx), Math.abs(dy)) < swipeThreshold) return;
    if (Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? 1 : -1, 0);
    else setDirection(0, dy > 0 ? 1 : -1);
  });

  canvas.addEventListener('pointercancel', (event) => {
    if (pointerStart?.id === event.pointerId) pointerStart = null;
  });

  const draw = () => {
    if (!ctx) return;
    ctx.fillStyle = '#020702';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#102210';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.fillStyle = '#dfff77';
    ctx.fillRect(food.x * grid + 5, food.y * grid + 5, grid - 10, grid - 10);
    ctx.fillStyle = '#7cff72';
    snake.forEach((part, i) => ctx.fillRect(part.x * grid + (i ? 4 : 2), part.y * grid + (i ? 4 : 2), grid - (i ? 8 : 4), grid - (i ? 8 : 4)));
    if (dead) {
      ctx.fillStyle = '#020702dd';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff8f8f';
      ctx.font = '28px ui-monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CONNECTION TERMINATED', canvas.width / 2, canvas.height / 2 - 12);
      ctx.fillStyle = '#8fa88f';
      ctx.font = '15px ui-monospace';
      ctx.fillText('SPACE OR TAP TO REINITIALIZE', canvas.width / 2, canvas.height / 2 + 24);
    }
  };

  const tick = () => {
    if (!dead) {
      dir = nextDir;
      turnQueued = false;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some((part) => part.x === head.x && part.y === head.y)) {
        dead = true;
      } else {
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 100;
          scoreNode.textContent = String(score).padStart(4, '0');
          spawnFood();
        } else {
          snake.pop();
        }
      }
    }
    draw();
  };

  reset();
  draw();
  window.setInterval(tick, 100);
}
