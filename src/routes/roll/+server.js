import { json } from '@sveltejs/kit';

const history = [];

export function GET() {
  const die1 = Math.ceil(Math.random() * 6);
  const die2 = Math.ceil(Math.random() * 6);
  const result = { die1, die2, total: die1 + die2 };
  history.unshift(result);
  if (history.length > 10) history.pop();
  return json({ current: result, history: [...history] });
}
