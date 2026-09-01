function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Draws `count` items spread as evenly as possible across each group in `grouped`. */
export function proportionalDraw<T>(grouped: Map<string, T[]>, count: number): T[] {
  const groups = [...grouped.entries()].map(([key, items]) => ({
    key,
    items: shuffle(items),
    taken: 0,
  }));
  const result: T[] = [];
  let remaining = count;
  let round = 0;
  while (remaining > 0 && groups.some((g) => g.taken < g.items.length)) {
    for (const g of groups) {
      if (remaining <= 0) break;
      if (g.taken < g.items.length) {
        result.push(g.items[g.taken]);
        g.taken++;
        remaining--;
      }
    }
    round++;
    if (round > 10000) break; // safety guard
  }
  return shuffle(result);
}

export { shuffle };
