import { json } from '@sveltejs/kit';
import { history, addRoll } from '$lib/rollHistory.js';

export function GET() {
  const die1 = Math.ceil(Math.random() * 6);
  const die2 = Math.ceil(Math.random() * 6);
  const result = { die1, die2, total: die1 + die2 };
  addRoll(result);
  return json({ current: result, history: [...history] });
}
