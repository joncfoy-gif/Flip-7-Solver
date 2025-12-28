import { addCounts, cardToKey, dec, emptyCounts, inc, initialDeckCounts, totalCards, zeroCountsLike } from "./deck";
import { Action, Card, CardKey, GameState, NumberValue, Player } from "./types";

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function makePlayer(i: number): Player {
  return {
    id: uid("p"),
    name: `Player ${i}`,
    status: "active",
    round_numbers: [],
    round_modifiers: [],
    has_second_chance: false,
    round_cards: []
  };
}

export function initialGameState(): GameState {
  const p1 = makePlayer(1);
  const p2 = makePlayer(2);
  return {
    deck_remaining: initialDeckCounts(),
    discard_pile: emptyCounts(),
    players: [p1, p2],
    active_player_id: p1.id,
    round_index: 1,
    log: [{ id: uid("e"), ts: Date.now(), text: "New game started" }]
  };
}

function log(state: GameState, text: string): GameState {
  return { ...state, log: [{ id: uid("e"), ts: Date.now(), text }, ...state.log] };
}

function updatePlayer(state: GameState, player_id: string, fn: (p: Player) => Player): GameState {
  return {
    ...state,
    players: state.players.map(p => (p.id === player_id ? fn(p) : p))
  };
}

function drawUnknownKey(state: GameState): CardKey | null {
  const keys = Object.keys(state.deck_remaining) as CardKey[];
  const r = totalCards(state.deck_remaining);
  if (r <= 0) return null;

  let pick = Math.floor(Math.random() * r);
  for (const k of keys) {
    const c = state.deck_remaining[k];
    if (pick < c) return k;
    pick -= c;
  }
  return null;
}

function applyKeyToPlayer(p: Player, key: CardKey): Player {
  if (key.startsWith("n_")) {
    const v = Number(key.slice(2)) as NumberValue;
    const already = p.round_numbers.includes(v);
    if (already) {
      if (p.has_second_chance) {
        return { ...p, has_second_chance: false, round_cards: [...p.round_cards, key] };
      }
      return { ...p, status: "busted", round_cards: [...p.round_cards, key] };
    }
    return { ...p, round_numbers: [...p.round_numbers, v], round_cards: [...p.round_cards, key] };
  }

  if (key === "a_second_chance") {
    return { ...p, has_second_chance: true, round_cards: [...p.round_cards, key] };
  }

  if (key === "a_freeze") {
    return { ...p, status: "frozen", round_cards: [...p.round_cards, key] };
  }

  if (key.startsWith("m_")) {
    const mod = key.slice(2) as any;
    return { ...p, round_modifiers: [...p.round_modifiers, mod], round_cards: [...p.round_cards, key] };
  }

  return { ...p, round_cards: [...p.round_cards, key] };
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "add_player": {
      const next = makePlayer(state.players.length + 1);
      return log({ ...state, players: [...state.players, next] }, `Added ${next.name}`);
    }

    case "remove_player": {
      const players = state.players.filter(p => p.id !== action.player_id);
      const active = players[0]?.id ?? null;
      return log({ ...state, players, active_player_id: active }, "Removed player");
    }

    case "rename_player": {
      const s = updatePlayer(state, action.player_id, p => ({ ...p, name: action.name }));
      return log(s, "Renamed player");
    }

    case "set_active_player": {
      return { ...state, active_player_id: action.player_id };
    }

    case "player_stay": {
      const s = updatePlayer(state, action.player_id, p => ({ ...p, status: "stayed" }));
      const who = state.players.find(p => p.id === action.player_id)?.name ?? "Player";
      return log(s, `${who} stayed`);
    }

    case "deal": {
      if (totalCards(state.deck_remaining) <= 0) {
        return log(state, "Deck is empty. Shuffle to continue");
      }

      let key: CardKey | null = null;

      if (action.target.type === "unknown") {
        key = drawUnknownKey(state);
      } else {
        const card: Card = action.target.card;
        key = cardToKey(card);
      }

      if (!key) return state;
      if (state.deck_remaining[key] <= 0) return log(state, "That card is not remaining in the deck");

      let s = { ...state, deck_remaining: dec(state.deck_remaining, key) };
      s = updatePlayer(s, action.player_id, p => applyKeyToPlayer(p, key!));

      const who = state.players.find(p => p.id === action.player_id)?.name ?? "Player";
      return log(s, `${who} received ${key}`);
    }

    case "end_round": {
      let discardAdds = emptyCounts();

      state.players.forEach(p => {
        p.round_cards.forEach(k => {
          discardAdds = inc(discardAdds, k);
        });
      });

      const players = state.players.map(p => ({
        ...p,
        status: "active",
        round_numbers: [],
        round_modifiers: [],
        has_second_chance: false,
        round_cards: []
      }));

      const nextState: GameState = {
        ...state,
        discard_pile: addCounts(state.discard_pile, discardAdds),
        players,
        round_index: state.round_index + 1
      };

      return log(nextState, `Round ${state.round_index} ended`);
    }

    case "shuffle": {
      const nextDeck = addCounts(state.deck_remaining, state.discard_pile);
      const nextState: GameState = {
        ...state,
        deck_remaining: nextDeck,
        discard_pile: zeroCountsLike(state.discard_pile)
      };
      return log(nextState, "Shuffled discard into deck");
    }

    case "reset_all": {
      return initialGameState();
    }

    default:
      return state;
  }
}
