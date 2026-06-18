<h1>🎲 Dice Roller</h1>
<p class="subtitle">Choose your game</p>

<div class="menu">
  <a href="/risk" class="card">
    <span class="card-icon">⚔️</span>
    <h2>Risk Battle Calculator</h2>
    <p>Simulate battles with standard Risk rules and see every dice roll round-by-round.</p>
  </a>
  <a href="/catan" class="card">
    <span class="card-icon">🎲</span>
    <h2>Catan Dice Roller</h2>
    <p>Roll two dice and track your roll history across the session.</p>
  </a>
</div>

<style>
  h1 {
    font-size: 2rem;
    margin-bottom: 8px;
    letter-spacing: 2px;
    color: #e0aaff;
  }

  .subtitle {
    color: #555;
    margin-bottom: 48px;
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .menu {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .card {
    background: #16213e;
    border: 2px solid #2a2a4a;
    border-radius: 20px;
    padding: 36px 28px;
    width: 240px;
    color: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  }

  .card:hover {
    border-color: #7b2ff7;
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(123, 47, 247, 0.2);
  }

  .card-icon { font-size: 2.5rem; line-height: 1; }

  .card h2 {
    font-size: 1.05rem;
    color: #e0aaff;
    font-weight: 600;
  }

  .card p {
    font-size: 0.85rem;
    color: #555;
    line-height: 1.6;
  }
</style>
