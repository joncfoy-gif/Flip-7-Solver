import { Card, CardKey, NumberValue, PileCounts } from "./types";

export function emptyCounts(): PileCounts {
  const counts: any = {};
  for (let v = 0; v <= 12; v++) counts[`n_${v}`] = 0;
  counts["a_flip_three"] = 0;
  counts["a_freeze"] = 0;
  counts["a_second_chance"] = 0;
  counts["m_plus_2"] = 0;
  counts["m_plus_4"] = 0;
  counts["m_plus_6"] = 0;
  counts["m_plus_8"] = 0;
  counts["m_plus_10"] = 0;
  counts["m_x2"] = 0;
  return counts as PileCounts;
}

export function initialDeckCounts(): PileCounts {
  const c = emptyCounts();
  c["n_0"] = 1;
  for (let v = 1 as NumberValue; v <= 12; v = (v + 1) as NumberValue) {
    c[`n_${v}`] = v;
  }
  c["a_flip_three"] = 3;
  c["a_freeze"] = 3;
  c["a_second_chance"] = 3;

  c["m_plus_2"] = 1;
  c["m_plus_4"] = 1;
  c["m_plus_6"] = 1;
  c["m_plus_8"] = 1;
  c["m_plus_10"] = 1;
  c["m_x2"] = 1;

  return c;
}

export function cardToKey(card: Card): CardKey {
  if (card.kind === "number") return `n_${card.value}`;
  if (card.kind === "action") return `a_${card.value}`;
  return `m_${card.value}`;
}

export function totalCards(counts: PileCounts): number {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

export function canDraw(counts: PileCounts, key: CardKey): boolean {
  return counts[key] > 0;
}

export function dec(counts: PileCounts, key: CardKey): PileCounts {
  return { ...counts, [key]: Math.max(0, counts[key] - 1) };
}

export function inc(counts: PileCounts, key: CardKey): PileCounts {
  return { ...counts, [key]: counts[key] + 1 };
}

export function addCounts(a: PileCounts, b: PileCounts): PileCounts {
  const out = { ...a };
  (Object.keys(out) as CardKey[]).forEach(k => {
    out[k] = (a[k] ?? 0) + (b[k] ?? 0);
  });
  return out;
}

export function zeroCountsLike(counts: PileCounts): PileCounts {
  const out = { ...counts };
  (Object.keys(out) as CardKey[]).forEach(k => (out[k] = 0));
  return out;
}
