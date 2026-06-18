<script>
  const FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  let attackerTroops = $state(5);
  let defenderTroops = $state(3);
  let riskResult = $state(null);
  let riskHistory = $state([]);

  function simulateRisk() {
    let atk = Math.max(2, parseInt(attackerTroops) || 2);
    let def = Math.max(1, parseInt(defenderTroops) || 1);
    const newRounds = [];

    while (atk > 1 && def > 0) {
      const atkDice = Math.min(atk - 1, 3);
      const defDice = Math.min(def, 2);

      const atkRolls = Array.from({ length: atkDice }, () => Math.ceil(Math.random() * 6))
        .sort((a, b) => b - a);
      const defRolls = Array.from({ length: defDice }, () => Math.ceil(Math.random() * 6))
        .sort((a, b) => b - a);

      const pairs = Math.min(atkDice, defDice);
      const comparisons = [];
      let atkLost = 0;
      let defLost = 0;

      for (let i = 0; i < pairs; i++) {
        const atkWins = atkRolls[i] > defRolls[i];
        comparisons.push({ atkDie: atkRolls[i], defDie: defRolls[i], atkWins });
        if (atkWins) { def--; defLost++; } else { atk--; atkLost++; }
      }

      newRounds.push({ atkRolls, defRolls, comparisons, atkLost, defLost, atkAfter: atk, defAfter: def });
    }

    riskHistory = newRounds;
    riskResult = { attacker: atk, defender: def, attackerWon: def === 0 };
  }
</script>

<a href="/" class="back-link">← Menu</a>

<h1>⚔️ Risk Battle Calculator</h1>

<div class="risk-inputs">
  <div class="input-group">
    <label for="atk">Attacker Troops</label>
    <input id="atk" type="number" bind:value={attackerTroops} min="2" />
  </div>
  <div class="vs">VS</div>
  <div class="input-group">
    <label for="def">Defender Troops</label>
    <input id="def" type="number" bind:value={defenderTroops} min="1" />
  </div>
</div>

<button onclick={simulateRisk}>Simulate Battle</button>

{#if riskResult}
  <div class="risk-result" class:atk-win={riskResult.attackerWon} class:def-win={!riskResult.attackerWon}>
    <div class="winner">
      {riskResult.attackerWon ? '⚔️ Attacker Wins!' : '🛡️ Defender Wins!'}
    </div>
    <div class="troop-counts">
      <div class="troop-card">
        <span class="troop-label">Attacker</span>
        <span class="troop-num">{riskResult.attacker}</span>
        <span class="troop-label">troops left</span>
      </div>
      <div class="troop-card">
        <span class="troop-label">Defender</span>
        <span class="troop-num">{riskResult.defender}</span>
        <span class="troop-label">troops left</span>
      </div>
    </div>
  </div>
{/if}

<div class="history">
  <h2>Roll History</h2>
  <ul class="history-list">
    {#if riskHistory.length === 0}
      <li class="empty">No battles yet.</li>
    {:else}
      {#each riskHistory as round, i}
        <li
          class:first={i === 0}
          class:atk-lost={round.atkLost > round.defLost}
          class:split={round.atkLost > 0 && round.defLost > 0}
        >
          <div class="round-top">
            <span class="roll-dice-str">
              <span class="owner-tag atk-tag">ATK</span>
              {#each round.atkRolls as val, di}
                <span class="die-face" class:dim={di < round.comparisons.length && !round.comparisons[di].atkWins}>{FACES[val]}</span>
              {/each}
              <span class="vs-divider">vs</span>
              <span class="owner-tag def-tag">DEF</span>
              {#each round.defRolls as val, di}
                <span class="die-face" class:dim={di < round.comparisons.length && round.comparisons[di].atkWins}>{FACES[val]}</span>
              {/each}
            </span>
            <span class="roll-result">
              {#if round.defLost > 0}<span class="res-atk">Def -{round.defLost}</span>{/if}
              {#if round.atkLost > 0}<span class="res-def">Atk -{round.atkLost}</span>{/if}
            </span>
          </div>
          <div class="round-troops">
            <span class="troop-after atk-after">⚔️ {round.atkAfter}</span>
            <span class="troop-sep">·</span>
            <span class="troop-after def-after">🛡️ {round.defAfter}</span>
          </div>
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

  .risk-inputs {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .input-group label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #888;
  }

  .input-group input {
    width: 110px;
    padding: 12px 16px;
    font-size: 1.6rem;
    font-weight: bold;
    text-align: center;
    background: #16213e;
    color: #eee;
    border: 2px solid #2a2a4a;
    border-radius: 12px;
    outline: none;
    transition: border-color 0.2s;
  }

  .input-group input:focus { border-color: #7b2ff7; }

  .vs {
    font-size: 1.2rem;
    font-weight: bold;
    color: #555;
    letter-spacing: 2px;
    padding-top: 20px;
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

  button:hover { background: #9d4edd; }
  button:active { transform: scale(0.96); }

  .risk-result {
    margin-top: 32px;
    text-align: center;
    padding: 24px 32px;
    background: #16213e;
    border-radius: 16px;
    border: 2px solid #2a2a4a;
    min-width: 320px;
  }

  .risk-result.atk-win { border-color: #7b2ff7; }
  .risk-result.def-win { border-color: #2196f3; }

  .winner {
    font-size: 1.4rem;
    font-weight: bold;
    color: #e0aaff;
    margin-bottom: 20px;
  }

  .troop-counts {
    display: flex;
    gap: 32px;
    justify-content: center;
  }

  .troop-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .troop-num {
    font-size: 2.5rem;
    font-weight: bold;
    color: #c77dff;
    line-height: 1;
  }

  .troop-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
  }

  .history {
    margin-top: 40px;
    width: 100%;
    max-width: 520px;
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
    flex-direction: column;
    gap: 6px;
    font-size: 0.95rem;
    border-left: 3px solid #7b2ff7;
  }

  .round-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .round-troops {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    letter-spacing: 0.5px;
  }

  .troop-after { font-weight: bold; }
  .atk-after { color: #c77dff; }
  .def-after { color: #69b4ff; }
  .troop-sep { color: #333; }

  .history-list li.atk-lost { border-left-color: #ff6b6b; }
  .history-list li.split { border-left-color: #f4a261; }
  .history-list li.first { border-left-color: #e0aaff; }
  .history-list li.first.atk-lost { border-left-color: #ffb3b3; }
  .history-list li.first.split { border-left-color: #ffd199; }

  .roll-dice-str {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #ccc;
    flex-wrap: wrap;
  }

  .owner-tag {
    font-size: 0.65rem;
    font-weight: bold;
    letter-spacing: 1px;
    padding: 1px 4px;
    border-radius: 4px;
  }

  .atk-tag { background: rgba(199, 125, 255, 0.15); color: #c77dff; }
  .def-tag { background: rgba(105, 180, 255, 0.15); color: #69b4ff; }

  .die-face { font-size: 1.25rem; line-height: 1; }
  .die-face.dim { opacity: 0.3; }

  .vs-divider {
    font-size: 0.7rem;
    color: #444;
    letter-spacing: 1px;
    padding: 0 2px;
  }

  .roll-result {
    display: flex;
    gap: 6px;
    font-weight: bold;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .res-atk { color: #c77dff; }
  .res-def { color: #ff6b6b; }

  .empty { color: #555; font-size: 0.9rem; text-align: center; padding: 16px; }
</style>
