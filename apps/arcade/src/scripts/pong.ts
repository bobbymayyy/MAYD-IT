const canvas = document.querySelector<HTMLCanvasElement>('#pong');
const leftScoreNode = document.querySelector<HTMLElement>('#left-score');
const rightScoreNode = document.querySelector<HTMLElement>('#right-score');

if (canvas && leftScoreNode && rightScoreNode) {
  const ctx = canvas.getContext('2d');
  const keys = new Set<string>();
  const paddle = { w: 12, h: 82, speed: 6 };
  const pointerSides = new Map<number, 'left' | 'right'>();
  let leftY = canvas.height / 2 - paddle.h / 2;
  let rightY = leftY;
  let leftScore = 0;
  let rightScore = 0;
  let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, r: 7 };

  const serve = (direction = Math.random() > .5 ? 1 : -1) => {
    if (ball.vx !== 0) return;
    ball.vx = 5 * direction;
    ball.vy = Math.random() * 4 - 2;
  };

  const resetBall = () => {
    ball = { ...ball, x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0 };
  };

  const updateScores = () => {
    leftScoreNode.textContent = String(leftScore).padStart(2, '0');
    rightScoreNode.textContent = String(rightScore).padStart(2, '0');
  };

  const movePaddleToPointer = (event: PointerEvent, side: 'left' | 'right') => {
    const rect = canvas.getBoundingClientRect();
    const y = (event.clientY - rect.top) * (canvas.height / rect.height) - paddle.h / 2;
    const clamped = Math.max(0, Math.min(canvas.height - paddle.h, y));
    if (side === 'left') leftY = clamped;
    else rightY = clamped;
  };

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    keys.add(key);
    if (['w', 's', 'arrowup', 'arrowdown', ' '].includes(key)) event.preventDefault();
    if (event.key === ' ') serve();
  });
  document.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const side = event.clientX - rect.left < rect.width / 2 ? 'left' : 'right';
    pointerSides.set(event.pointerId, side);
    canvas.setPointerCapture?.(event.pointerId);
    movePaddleToPointer(event, side);
    serve();
  });
  canvas.addEventListener('pointermove', (event) => {
    const side = pointerSides.get(event.pointerId);
    if (side) movePaddleToPointer(event, side);
  });
  const releasePointer = (event: PointerEvent) => {
    pointerSides.delete(event.pointerId);
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);

  const update = () => {
    if (keys.has('w')) leftY -= paddle.speed;
    if (keys.has('s')) leftY += paddle.speed;
    if (keys.has('arrowup')) rightY -= paddle.speed;
    if (keys.has('arrowdown')) rightY += paddle.speed;
    leftY = Math.max(0, Math.min(canvas.height - paddle.h, leftY));
    rightY = Math.max(0, Math.min(canvas.height - paddle.h, rightY));

    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) ball.vy *= -1;

    if (ball.vx < 0 && ball.x - ball.r <= 30 + paddle.w && ball.x > 30 && ball.y + ball.r >= leftY && ball.y - ball.r <= leftY + paddle.h) {
      ball.vx = Math.abs(ball.vx) + .2;
      ball.vy += ((ball.y - (leftY + paddle.h / 2)) / paddle.h) * 3;
    }
    if (ball.vx > 0 && ball.x + ball.r >= canvas.width - 30 - paddle.w && ball.x < canvas.width - 30 && ball.y + ball.r >= rightY && ball.y - ball.r <= rightY + paddle.h) {
      ball.vx = -(Math.abs(ball.vx) + .2);
      ball.vy += ((ball.y - (rightY + paddle.h / 2)) / paddle.h) * 3;
    }

    if (ball.x < -20) {
      rightScore++;
      updateScores();
      resetBall();
    }
    if (ball.x > canvas.width + 20) {
      leftScore++;
      updateScores();
      resetBall();
    }
  };

  const draw = () => {
    if (!ctx) return;
    ctx.fillStyle = '#020702';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#183318';
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#7cff72';
    ctx.fillRect(30, leftY, paddle.w, paddle.h);
    ctx.fillRect(canvas.width - 30 - paddle.w, rightY, paddle.w, paddle.h);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    if (ball.vx === 0) {
      ctx.fillStyle = '#8fa88f';
      ctx.font = '14px ui-monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SPACE OR TAP TO SERVE', canvas.width / 2, canvas.height / 2 + 48);
    }
  };

  const loop = () => {
    update();
    draw();
    requestAnimationFrame(loop);
  };

  updateScores();
  loop();
}
