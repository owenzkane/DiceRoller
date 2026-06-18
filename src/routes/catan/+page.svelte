<script>
  const FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  let { data } = $props();

  let die1 = $state('?');
  let die2 = $state('?');
  let total = $state('Roll to begin!');
  let history = $state(data.history);
  let rolling = $state(false);

  let gameActive = $state(false);
  let tally = $state(Object.fromEntries(NUMBERS.map(n => [n, 0])));
  let simCount = $state(10);

  const totalRolls = $derived(Object.values(tally).reduce((a, b) => a + b, 0));
  const maxCount = $derived(Math.max(...Object.values(tally), 1));

  function startGame() {
    tally = Object.fromEntries(NUMBERS.map(n => [n, 0]));
    gameActive = true;
  }

  function endGame() {
    gameActive = false;
  }

  function simulateRolls() {
    const count = Math.max(1, parseInt(simCount) || 1);
    const newTally = { ...tally };
    for (let i = 0; i < count; i++) {
      const d1 = Math.ceil(Math.random() * 6);
      const d2 = Math.ceil(Math.random() * 6);
      newTally[d1 + d2]++;
    }
    tally = newTally;
  }

  async function rollDice() {
    rolling = true;
    const res = await fetch('/roll');
    const result = await res.json();
    await new Promise(r => setTimeout(r, 400));
    die1 = FACES[result.current.die1];
    die2 = FACES[result.current.die2];
    total = `Die 1: ${result.current.die1}  •  Die 2: ${result.current.die2}  •  Total: ${result.current.total}`;
    history = result.history;
    if (gameActive) {
      tally = { ...tally, [result.current.total]: tally[result.current.total] + 1 };
    }
    rolling = false;
  }
</script>

<a href="/" class="back-link">← Menu</a>

<h1>🎲 Catan Dice Roller</h1>

<div class="dice-area">
  <div class="die" class:rolling>{die1}</div>
  <div class="die" class:rolling>{die2}</div>
</div>

<div class="total">{total}</div>

<div class="actions">
  <button class="roll-btn" onclick={rollDice} disabled={rolling}>Roll Dice</button>
  {#if !gameActive}
    <button class="game-btn start" onclick={startGame}>Start Game</button>
  {:else}
    <button class="game-btn end" onclick={endGame}>End Game</button>
  {/if}
</div>

{#if gameActive}
  <div class="sim-row">
    <input class="sim-input" type="number" bind:value={simCount} min="1" max="100000" />
    <button class="sim-btn" onclick={simulateRolls}>Simulate Rolls</button>
  </div>
{/if}

{#if gameActive}
  <div class="tally">
    <div class="tally-header">
      <h2>Roll Tally</h2>
      <span class="total-rolls">{totalRolls} roll{totalRolls !== 1 ? 's' : ''}</span>
    </div>
    <div class="chart">
      {#each NUMBERS as n}
        <div class="bar-col">
          <span class="bar-count">{tally[n] > 0 ? tally[n] : ''}</span>
          <span class="bar-pct">{tally[n] > 0 ? (tally[n] / totalRolls * 100).toFixed(1) + '%' : ''}</span>
          <div class="bar-track">
            <div
              class="bar"
              class:seven={n === 7}
              style="height: {(tally[n] / maxCount) * 100}%"
            ></div>
          </div>
          <span class="bar-label" class:seven={n === 7}>{n}</span>
        </div>
      {/each}
    </div>
  </div>
{/if}

<div class="history">
  <h2>Last 10 Rolls</h2>
  <ul class="history-list">
    {#if history.length === 0}
      <li class="empty">No rolls yet.</li>
    {:else}
      {#each history as roll, i}
        <li class:first={i === 0}>
          <span class="roll-dice-str">🎲 {roll.die1} + {roll.die2}</span>
          <span class="roll-total">= {roll.total}</span>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style>
  .back-link {
    position: fixed;
    top: 20px;
    left: 20px;
    background: #16213e;
    color: #aaa;
    border: 1px solid #2a2a4a;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: background 0.2s, color 0.2s;
  }

  .back-link:hover { background: #1e2a50; color: #eee; }

  h1 {
    font-size: 2rem;
    margin-bottom: 32px;
    letter-spacing: 2px;
    color: #e0aaff;
  }

  .dice-area {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
  }

  .die {
    width: 100px;
    height: 100px;
    background: #fff;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    transition: transform 0.15s ease;
    color: #1a1a2e;
  }

  .die.rolling { animation: shake 0.4s ease; }

  @keyframes shake {
    0%   { transform: rotate(0deg) scale(1); }
    20%  { transform: rotate(-10deg) scale(1.1); }
    40%  { transform: rotate(10deg) scale(1.1); }
    60%  { transform: rotate(-8deg) scale(1.05); }
    80%  { transform: rotate(6deg) scale(1.05); }
    100% { transform: rotate(0deg) scale(1); }
  }

  .total {
    font-size: 1.4rem;
    margin-bottom: 28px;
    color: #c77dff;
  }

  /* ── Buttons ── */
  .actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .roll-btn {
    background: #7b2ff7;
    color: #fff;
    border: none;
    padding: 14px 40px;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    letter-spacing: 1px;
    box-shadow: 0 4px 16px rgba(123, 47, 247, 0.5);
    transition: background 0.2s, transform 0.1s;
  }

  .roll-btn:hover:not(:disabled) { background: #9d4edd; }
  .roll-btn:active:not(:disabled) { transform: scale(0.96); }
  .roll-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .game-btn {
    border: none;
    padding: 14px 28px;
    font-size: 1rem;
    border-radius: 50px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: background 0.2s, transform 0.1s;
  }

  .game-btn:active { transform: scale(0.96); }

  .game-btn.start {
    background: #16213e;
    color: #e0aaff;
    border: 2px solid #7b2ff7;
  }

  .game-btn.start:hover { background: #1e2a50; }

  .game-btn.end {
    background: #16213e;
    color: #ff6b6b;
    border: 2px solid #ff6b6b;
  }

  .game-btn.end:hover { background: #1e1a2e; }

  /* ── Simulate Row ── */
  .sim-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }

  .sim-input {
    width: 100px;
    padding: 10px 14px;
    font-size: 1rem;
    text-align: center;
    background: #16213e;
    color: #eee;
    border: 2px solid #2a2a4a;
    border-radius: 50px;
    outline: none;
    transition: border-color 0.2s;
  }

  .sim-input:focus { border-color: #7b2ff7; }

  .sim-btn {
    background: #16213e;
    color: #c77dff;
    border: 2px solid #7b2ff7;
    padding: 10px 24px;
    font-size: 1rem;
    border-radius: 50px;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.2s, transform 0.1s;
  }

  .sim-btn:hover { background: #1e2a50; }
  .sim-btn:active { transform: scale(0.96); }

  /* ── Tally Chart ── */
  .tally {
    margin-top: 40px;
    width: 100%;
    max-width: 520px;
  }

  .tally-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;
  }

  .tally-header h2 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #888;
  }

  .total-rolls {
    font-size: 0.82rem;
    color: #555;
    letter-spacing: 1px;
  }

  .chart {
    background: #16213e;
    border-radius: 16px;
    padding: 20px 16px 12px;
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 200px;
  }

  .bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    height: 100%;
  }

  .bar-count {
    font-size: 0.72rem;
    color: #888;
    height: 16px;
    line-height: 16px;
  }

  .bar-pct {
    font-size: 0.62rem;
    color: #555;
    height: 14px;
    line-height: 14px;
  }

  .bar-track {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
  }

  .bar {
    width: 100%;
    background: #7b2ff7;
    border-radius: 4px 4px 0 0;
    min-height: 2px;
    transition: height 0.3s ease;
  }

  .bar.seven { background: #f4a261; }

  .bar-label {
    font-size: 0.78rem;
    color: #555;
    line-height: 1;
  }

  .bar-label.seven { color: #f4a261; font-weight: bold; }

  /* ── History ── */
  .history {
    margin-top: 40px;
    width: 100%;
    max-width: 440px;
  }

  .history h2 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #888;
    margin-bottom: 12px;
  }

  .history-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .history-list li {
    background: #16213e;
    border-radius: 10px;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
    border-left: 3px solid #7b2ff7;
  }

  .history-list li.first { border-left-color: #e0aaff; color: #e0aaff; }

  .roll-dice-str { color: #ccc; }
  .roll-total { font-weight: bold; color: #c77dff; }
  .empty { color: #555; font-size: 0.9rem; text-align: center; padding: 16px; }
</style>
