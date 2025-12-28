import { CardKey, GameState, NumberValue } from "./types";
import { totalCards } from "./deck";

export function remainingTotal(state: GameState): number {
  return totalCards(state.deck_remaining);
}

export function remainingNumberCount(state: GameState, v: NumberValue): number {
  return state.deck_remaining[`n_${v}`];
}

export function duplicateChanceNextCard(state: GameState, player_id: string): number {
  const p = state.players.find(x => x.id === player_id);
  if (!p) return 0;

  const r = remainingTotal(state);
  if (r <= 0) return 0;

  const set = new Set<NumberValue>(p.round_numbers);
  let dup = 0;
  set.forEach(v => {
    dup += remainingNumberCount(state, v);
  });

  return dup / r;
}

export function bustChanceNextCard(state: GameState, player_id: string): number {
  const p = state.players.find(x => x.id === player_id);
  if (!p) return 0;
  if (p.has_second_chance) return 0;
  return duplicateChanceNextCard(state, player_id);
}

export function prettyPct(x: number): string {
  const clamped = Math.max(0, Math.min(1, x));
  const pct = clamped * 100;
  return pct >= 10 ? `${pct.toFixed(1)}%` : `${pct.toFixed(2)}%`;
}

export function isNumberKey(k: CardKey): boolean {
  return k.startsWith("n_");
}
