<script>
  const FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  let die1 = $state('?');
  let die2 = $state('?');
  let total = $state('Roll to begin!');
  let history = $state([]);
  let rolling = $state(false);

  async function rollDice() {
    rolling = true;

    const res = await fetch('/roll');
    const data = await res.json();

    await new Promise(r => setTimeout(r, 400));

    die1 = FACES[data.current.die1];
    die2 = FACES[data.current.die2];
    total = `Die 1: ${data.current.die1}  •  Die 2: ${data.current.die2}  •  Total: ${data.current.total}`;
    history = data.history;
    rolling = false;
  }
</script>

<h1>🎲 Dice Roller</h1>

<div class="dice-area">
  <div class="die" class:rolling>{die1}</div>
  <div class="die" class:rolling>{die2}</div>
</div>

<div class="total">{total}</div>

<button onclick={rollDice} disabled={rolling}>Roll Dice</button>

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
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    font-family: 'Segoe UI', sans-serif;
    background: #1a1a2e;
    color: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 40px 20px;
  }

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

  .die.rolling {
    animation: shake 0.4s ease;
  }

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

  button {
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

  button:hover:not(:disabled) { background: #9d4edd; }
  button:active:not(:disabled) { transform: scale(0.96); }
  button:disabled { opacity: 0.6; cursor: not-allowed; }

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

  .history-list li.first {
    border-left-color: #e0aaff;
    color: #e0aaff;
  }

  .roll-dice-str { color: #ccc; }
  .roll-total { font-weight: bold; color: #c77dff; }

  .empty { color: #555; font-size: 0.9rem; text-align: center; padding: 16px; }
</style>
