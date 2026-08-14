const sectorButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-sector]')];
const actionButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-action]')];
const selectedLabel = document.querySelector<HTMLElement>('#signal-selected');
const stabilityLabel = document.querySelector<HTMLElement>('#signal-stability');
const alertLabel = document.querySelector<HTMLElement>('#signal-alert');
const timeLabel = document.querySelector<HTMLElement>('#signal-time');
const scoreLabel = document.querySelector<HTMLElement>('#signal-score');
const log = document.querySelector<HTMLElement>('#signal-log');
const restart = document.querySelector<HTMLButtonElement>('#signal-restart');

const names = ['NORTH ARRAY', 'EAST ARRAY', 'SOUTH ARRAY', 'WEST ARRAY'];
let load = [8, 12, 6, 10];
let hardening = [0, 0, 0, 0];
let selected = 0;
let timeLeft = 90;
let score = 0;
let running = true;
let tickHandle = 0;

const writeLog = (message: string) => {
  if (!log) return;
  const line = document.createElement('p');
  line.textContent = `> ${message}`;
  log.append(line);
  while (log.children.length > 8) log.firstElementChild?.remove();
  log.scrollTop = log.scrollHeight;
};

const stability = () => Math.max(0, Math.round(100 - load.reduce((sum, value) => sum + value, 0) / 4));

const render = () => {
  sectorButtons.forEach((button, index) => {
    const value = Math.max(0, Math.min(100, Math.round(load[index])));
    button.classList.toggle('is-selected', index === selected);
    button.classList.toggle('is-warning', value >= 55);
    button.classList.toggle('is-critical', value >= 80);
    const valueNode = button.querySelector('b');
    const bar = button.querySelector<HTMLElement>('i');
    if (valueNode) valueNode.textContent = `${String(value).padStart(2, '0')}%`;
    if (bar) bar.style.setProperty('--load', `${value}%`);
  });

  const currentStability = stability();
  if (selectedLabel) selectedLabel.textContent = names[selected];
  if (stabilityLabel) stabilityLabel.textContent = String(currentStability);
  if (timeLabel) timeLabel.textContent = String(timeLeft).padStart(3, '0');
  if (scoreLabel) scoreLabel.textContent = String(score).padStart(4, '0');
  if (alertLabel) {
    alertLabel.textContent = currentStability > 70 ? 'GREEN' : currentStability > 45 ? 'AMBER' : 'RED';
    alertLabel.dataset.level = alertLabel.textContent.toLowerCase();
  }
};

const stop = (success: boolean) => {
  running = false;
  window.clearInterval(tickHandle);
  actionButtons.forEach((button) => (button.disabled = true));
  writeLog(success ? `SIMULATION COMPLETE. FINAL SCORE ${score}.` : 'NETWORK COLLAPSE. SIMULATION FAILED.');
};

const tick = () => {
  if (!running) return;

  load = load.map((value, index) => {
    const pressure = 2.2 + Math.random() * 5.5;
    const mitigation = hardening[index] * 0.8;
    hardening[index] = Math.max(0, hardening[index] - 0.25);
    return Math.min(100, value + Math.max(0.5, pressure - mitigation));
  });

  if (Math.random() > 0.72) {
    const spike = Math.floor(Math.random() * 4);
    load[spike] = Math.min(100, load[spike] + 8 + Math.random() * 10);
    writeLog(`${names[spike]} REPORTS ANOMALOUS BURST.`);
  }

  timeLeft -= 1;
  score += Math.max(0, Math.floor(stability() / 10));
  render();

  if (load.some((value) => value >= 100) || stability() <= 5) stop(false);
  else if (timeLeft <= 0) stop(true);
};

const reset = () => {
  window.clearInterval(tickHandle);
  load = [8, 12, 6, 10];
  hardening = [0, 0, 0, 0];
  selected = 0;
  timeLeft = 90;
  score = 0;
  running = true;
  actionButtons.forEach((button) => (button.disabled = false));
  if (log) log.innerHTML = '<p>&gt; STRATEGIC NETWORK ONLINE.</p><p>&gt; KEEP ALL FOUR ARRAYS BELOW CRITICAL LOAD FOR 90 SECONDS.</p>';
  render();
  tickHandle = window.setInterval(tick, 1000);
};

sectorButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    selected = index;
    render();
  });
});

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!running) return;
    const action = button.dataset.action;
    if (action === 'scan') {
      score += 5;
      writeLog(`${names[selected]} LOAD CONFIRMED AT ${Math.round(load[selected])}%.`);
    } else if (action === 'intercept') {
      const reduction = 13 + Math.random() * 11;
      load[selected] = Math.max(0, load[selected] - reduction);
      score += Math.round(reduction * 2);
      writeLog(`${names[selected]} INTERCEPT SUCCESSFUL. LOAD REDUCED.`);
    } else if (action === 'harden') {
      hardening[selected] = Math.min(8, hardening[selected] + 4);
      score += 10;
      writeLog(`${names[selected]} HARDENING WINDOW ACTIVE.`);
    }
    render();
  });
});

restart?.addEventListener('click', reset);
reset();
