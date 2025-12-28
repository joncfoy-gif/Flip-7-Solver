import React, { useMemo, useState } from "react";
import { Action, Card, GameState, NumberValue } from "../state/types";
import { bustChanceNextCard, duplicateChanceNextCard, prettyPct, remainingTotal } from "../state/selectors";

function numberCard(value: NumberValue): Card {
  return { kind: "number", value };
}

export default function TableView(props: {
  state: GameState;
  dispatch: (a: Action) => void;
}) {
  const { state, dispatch } = props;

  const [dealMode, setDealMode] = useState<"unknown" | "number" | "second_chance" | "freeze" | "flip_three">("number");
  const [num, setNum] = useState<NumberValue>(0);

  const activeId = state.active_player_id ?? state.players[0]?.id ?? null;

  const rTotal = remainingTotal(state);

  const quickDealTarget = useMemo(() => {
    if (dealMode === "unknown") return { type: "unknown" } as const;
    if (dealMode === "second_chance") return { type: "specific", card: { kind: "action", value: "second_chance" } } as const;
    if (dealMode === "freeze") return { type: "specific", card: { kind: "action", value: "freeze" } } as const;
    if (dealMode === "flip_three") return { type: "specific", card: { kind: "action", value: "flip_three" } } as const;
    return { type: "specific", card: numberCard(num) } as const;
  }, [dealMode, num]);

  return (
    <div className="grid2">
      <div className="card">
        <div className="hrow" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Table</div>
            <div className="muted small">Round {state.round_index} · Remaining {rTotal}</div>
          </div>
          <div className="hrow">
            <button className="btn" onClick={() => dispatch({ type: "end_round" })} type="button">End round</button>
            <button className="btn" onClick={() => dispatch({ type: "shuffle" })} type="button">Shuffle</button>
          </div>
        </div>

        <div style={{ height: 10 }} />

        <div className="card" style={{ background: "#fbfbfb" }}>
          <div className="hrow">
            <div style={{ fontWeight: 700 }}>Deal tool</div>
            <span className="muted small">This updates the remaining deck so odds stay correct</span>
          </div>

          <div style={{ height: 10 }} />

          <div className="hrow">
            <select
              className="btn"
              value={dealMode}
              onChange={(e) => setDealMode(e.target.value as any)}
            >
              <option value="number">Number</option>
              <option value="second_chance">Second Chance</option>
              <option value="freeze">Freeze</option>
              <option value="flip_three">Flip Three</option>
              <option value="unknown">Unknown draw</option>
            </select>

            {dealMode === "number" ? (
              <select className="btn" value={num} onChange={(e) => setNum(Number(e.target.value) as NumberValue)}>
                {Array.from({ length: 13 }).map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            ) : null}

            <button
              className="btn btn_primary"
              onClick={() => {
                if (!activeId) return;
                dispatch({ type: "deal", player_id: activeId, target: quickDealTarget });
              }}
              type="button"
            >
              Deal to active player
            </button>

            <button className="btn" onClick={() => dispatch({ type: "add_player" })} type="button">
              Add player
            </button>
          </div>

          <div style={{ height: 10 }} />

          <div className="muted small">
            Tip: set the active player by tapping a player card. Use Unknown draw if you do not want to record exact card identity.
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 18 }}>Players</div>
        <div className="muted small">Tap a player to set active</div>

        <div style={{ height: 10 }} />

        <div style={{ display: "grid", gap: 10 }}>
          {state.players.map(p => {
            const dup = duplicateChanceNextCard(state, p.id);
            const bust = bustChanceNextCard(state, p.id);
            const isActive = p.id === activeId;

            return (
              <div
                key={p.id}
                className="card"
                style={{ borderColor: isActive ? "#1a5cff" : "#e6e6e6" }}
                onClick={() => dispatch({ type: "set_active_player", player_id: p.id })}
                role="button"
                tabIndex={0}
              >
                <div className="hrow" style={{ justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div className="muted small">Status: {p.status}{p.has_second_chance ? " · Second Chance ready" : ""}</div>
                  </div>
                  <div className="hrow">
                    <button className="btn" onClick={(e) => { e.stopPropagation(); dispatch({ type: "player_stay", player_id: p.id }); }} type="button">
                      Stay
                    </button>
                    <button className="btn btn_danger" onClick={(e) => { e.stopPropagation(); dispatch({ type: "remove_player", player_id: p.id }); }} type="button">
                      Remove
                    </button>
                  </div>
                </div>

                <div style={{ height: 10 }} />

                <div className="hrow">
                  <div className="pill">
                    <div className="muted small">Duplicate next</div>
                    <div className="big_num">{prettyPct(dup)}</div>
                  </div>

                  <div className="pill">
                    <div className="muted small">Bust next</div>
                    <div className="big_num">{prettyPct(bust)}</div>
                  </div>
                </div>

                <div style={{ height: 10 }} />

                <div className="small">
                  <div className="muted">Numbers in line</div>
                  <div>{p.round_numbers.length ? p.round_numbers.join(", ") : "None"}</div>
                </div>

                <div style={{ height: 10 }} />

                <div className="small">
                  <div className="muted">Round cards</div>
                  <div style={{ wordBreak: "break-word" }}>
                    {p.round_cards.length ? p.round_cards.join(" · ") : "None"}
                  </div>
                </div>

                <div style={{ height: 8 }} />

                <div className="muted small">
                  Remaining cards in deck: {rTotal}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
