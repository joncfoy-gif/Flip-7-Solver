import React from "react";
import { GameState } from "../state/types";

export default function HistoryView(props: { state: GameState }) {
  const { state } = props;

  return (
    <div className="card">
      <div style={{ fontWeight: 800, fontSize: 18 }}>History</div>
      <div className="muted small">Newest first</div>

      <div style={{ height: 12 }} />

      <div style={{ display: "grid", gap: 10 }}>
        {state.log.map(e => (
          <div key={e.id} className="card" style={{ background: "#fbfbfb" }}>
            <div style={{ fontWeight: 700 }}>{e.text}</div>
            <div className="muted small">{new Date(e.ts).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
