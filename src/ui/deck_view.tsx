import React from "react";
import { GameState } from "../state/types";
import { totalCards } from "../state/deck";

function row(label: string, value: number) {
  return (
    <div className="hrow" style={{ justifyContent: "space-between" }}>
      <div>{label}</div>
      <div className="kbd">{value}</div>
    </div>
  );
}

export default function DeckView(props: { state: GameState }) {
  const { state } = props;
  const r = totalCards(state.deck_remaining);
  const d = totalCards(state.discard_pile);

  return (
    <div className="grid2">
      <div className="card">
        <div style={{ fontWeight: 800, fontSize: 18 }}>Deck remaining</div>
        <div className="muted small">Total {r}</div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div style={{ fontWeight: 700 }}>Numbers</div>
          <div style={{ height: 8 }} />
          {Array.from({ length: 13 }).map((_, i) => row(String(i), state.deck_remaining[`n_${i}` as any]))}
        </div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div style={{ fontWeight: 700 }}>Actions</div>
          <div style={{ height: 8 }} />
          {row("Flip Three", state.deck_remaining["a_flip_three"])}
          {row("Freeze", state.deck_remaining["a_freeze"])}
          {row("Second Chance", state.deck_remaining["a_second_chance"])}
        </div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div style={{ fontWeight: 700 }}>Modifiers</div>
          <div style={{ height: 8 }} />
          {row("+2", state.deck_remaining["m_plus_2"])}
          {row("+4", state.deck_remaining["m_plus_4"])}
          {row("+6", state.deck_remaining["m_plus_6"])}
          {row("+8", state.deck_remaining["m_plus_8"])}
          {row("+10", state.deck_remaining["m_plus_10"])}
          {row("x2", state.deck_remaining["m_x2"])}
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 800, fontSize: 18 }}>Discard pile</div>
        <div className="muted small">Total {d}</div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div className="muted small">Discard grows when you end a round. Shuffle moves discard back into deck.</div>
        </div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div style={{ fontWeight: 700 }}>Numbers</div>
          <div style={{ height: 8 }} />
          {Array.from({ length: 13 }).map((_, i) => row(String(i), state.discard_pile[`n_${i}` as any]))}
        </div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div style={{ fontWeight: 700 }}>Actions</div>
          <div style={{ height: 8 }} />
          {row("Flip Three", state.discard_pile["a_flip_three"])}
          {row("Freeze", state.discard_pile["a_freeze"])}
          {row("Second Chance", state.discard_pile["a_second_chance"])}
        </div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div style={{ fontWeight: 700 }}>Modifiers</div>
          <div style={{ height: 8 }} />
          {row("+2", state.discard_pile["m_plus_2"])}
          {row("+4", state.discard_pile["m_plus_4"])}
          {row("+6", state.discard_pile["m_plus_6"])}
          {row("+8", state.discard_pile["m_plus_8"])}
          {row("+10", state.discard_pile["m_plus_10"])}
          {row("x2", state.discard_pile["m_x2"])}
        </div>
      </div>
    </div>
  );
}
