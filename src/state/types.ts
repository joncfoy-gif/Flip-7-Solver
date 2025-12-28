export type NumberValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type ActionCard = "flip_three" | "freeze" | "second_chance";
export type ModifierCard = "plus_2" | "plus_4" | "plus_6" | "plus_8" | "plus_10" | "x2";

export type Card =
  | { kind: "number"; value: NumberValue }
  | { kind: "action"; value: ActionCard }
  | { kind: "modifier"; value: ModifierCard };

export type CardKey =
  | `n_${NumberValue}`
  | `a_${ActionCard}`
  | `m_${ModifierCard}`;

export type PileCounts = Record<CardKey, number>;

export type PlayerStatus = "active" | "stayed" | "busted" | "frozen";

export type Player = {
  id: string;
  name: string;
  status: PlayerStatus;

  round_numbers: NumberValue[];
  round_modifiers: ModifierCard[];
  has_second_chance: boolean;

  round_cards: CardKey[];
};

export type EventLogItem = {
  id: string;
  ts: number;
  text: string;
};

export type GameState = {
  deck_remaining: PileCounts;
  discard_pile: PileCounts;

  players: Player[];
  active_player_id: string | null;

  round_index: number;

  log: EventLogItem[];
};

export type DealTarget =
  | { type: "specific"; card: Card }
  | { type: "unknown" };

export type Action =
  | { type: "add_player" }
  | { type: "remove_player"; player_id: string }
  | { type: "rename_player"; player_id: string; name: string }
  | { type: "set_active_player"; player_id: string }
  | { type: "player_stay"; player_id: string }
  | { type: "deal"; player_id: string; target: DealTarget }
  | { type: "end_round" }
  | { type: "shuffle" }
  | { type: "reset_all" };
