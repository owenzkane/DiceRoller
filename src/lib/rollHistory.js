export const history = [];

export function addRoll(roll) {
  history.unshift(roll);
  if (history.length > 10) history.pop();
}
