import { json } from '@sveltejs/kit';
import { history } from '$lib/rollHistory.js';

export function GET() {
  return json({ history: [...history] });
}
