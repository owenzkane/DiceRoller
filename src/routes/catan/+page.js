export async function load({ fetch }) {
  const res = await fetch('/history');
  const data = await res.json();
  return { history: data.history };
}
