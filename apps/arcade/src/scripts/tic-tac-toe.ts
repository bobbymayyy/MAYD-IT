const cells = [...document.querySelectorAll<HTMLButtonElement>('[data-cell]')];
const status = document.querySelector<HTMLElement>('#ttt-status');
const resetButton = document.querySelector<HTMLButtonElement>('#ttt-reset');
const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array<string>(9).fill('');
let over = false;
let machineThinking = false;
let cpuHandle = 0;

const winner = (state: string[], mark: string) => wins.some((line) => line.every((i) => state[i] === mark));
const free = (state: string[]) => state.map((value, i) => (value ? null : i)).filter((value): value is number => value !== null);

const minimax = (state: string[], maximizing: boolean): number => {
  if (winner(state, 'O')) return 10;
  if (winner(state, 'X')) return -10;
  const open = free(state);
  if (!open.length) return 0;

  if (maximizing) {
    let best = -Infinity;
    for (const i of open) {
      state[i] = 'O';
      best = Math.max(best, minimax(state, false));
      state[i] = '';
    }
    return best;
  }

  let best = Infinity;
  for (const i of open) {
    state[i] = 'X';
    best = Math.min(best, minimax(state, true));
    state[i] = '';
  }
  return best;
};

const render = () => {
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.disabled = over || machineThinking || Boolean(board[i]);
  });
};

const resolve = () => {
  if (winner(board, 'X')) {
    over = true;
    if (status) status.textContent = 'HUMAN VICTORY. RESULT ARCHIVED.';
    return;
  }
  if (winner(board, 'O')) {
    over = true;
    if (status) status.textContent = 'MACHINE VICTORY. RUN ANOTHER SIMULATION.';
    return;
  }
  if (!free(board).length) {
    over = true;
    if (status) status.textContent = 'STALEMATE. NO ADVANTAGE FOUND.';
  }
};

const cpuMove = () => {
  if (over) return;

  let bestScore = -Infinity;
  let move: number | null = null;
  for (const i of free(board)) {
    board[i] = 'O';
    const score = minimax(board, false);
    board[i] = '';
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }

  if (move !== null) board[move] = 'O';
  machineThinking = false;
  resolve();
  if (!over && status) status.textContent = 'YOUR MOVE. YOU ARE X.';
  render();
};

const reset = () => {
  window.clearTimeout(cpuHandle);
  board = Array<string>(9).fill('');
  over = false;
  machineThinking = false;
  if (status) status.textContent = 'YOU ARE X. THE MACHINE IS O.';
  render();
};

cells.forEach((cell, i) => {
  cell.addEventListener('click', () => {
    if (over || machineThinking || board[i]) return;
    board[i] = 'X';
    resolve();

    if (!over) {
      machineThinking = true;
      if (status) status.textContent = 'MACHINE EVALUATING...';
      cpuHandle = window.setTimeout(cpuMove, 220);
    }

    render();
  });
});

resetButton?.addEventListener('click', reset);
reset();
