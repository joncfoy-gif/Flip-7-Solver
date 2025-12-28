import React, { useMemo, useState } from "react";
import { initialGameState, gameReducer } from "./state/reducer";
import { makeHistory, push, redo, undo, HistoryState } from "./state/history";
import { Action, GameState } from "./state/types";
import { Tabs, TabKey } from "./ui/tabs";
import TableView from "./ui/table_view";
import DeckView from "./ui/deck_view";
import HistoryView from "./ui/history_view";

export default function App() {
  const [tab, setTab] = useState<TabKey>("table");
  const [hist, setHist] = useState<HistoryState<GameState>>(() => makeHistory(initialGameState()));

  const dispatch = (a: Action) => {
    if ((a as any).type === "undo") {
      setHist(h => undo(h));
      return;
    }
    if ((a as any).type === "redo") {
      setHist(h => redo(h));
      return;
    }
    const next = gameReducer(hist.present, a);
    setHist(h => push(h, next));
  };

  const canUndo = hist.past.length > 0;
  const canRedo = hist.future.length > 0;

  const header = useMemo(() => {
    return (
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="hrow" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Flip 7 bust odds</div>
            <div className="muted small">Tracks remaining deck and shows next draw risk per player</div>
          </div>
          <div className="hrow">
            <button className="btn" disabled={!canUndo} onClick={() => dispatch({ type: "reset_all" } as any)} type="button">
              Reset game
            </button>
            <button className="btn" disabled={!canUndo} onClick={() => setHist(h => undo(h))} type="button">
              Undo
            </button>
            <button className="btn" disabled={!canRedo} onClick={() => setHist(h => redo(h))} type="button">
              Redo
            </button>
          </div>
        </div>
      </div>
    );
  }, [canUndo, canRedo]);

  return (
    <div className="app_shell">
      {header}

      {tab === "table" ? <TableView state={hist.present} dispatch={dispatch} /> : null}
      {tab === "deck" ? <DeckView state={hist.present} /> : null}
      {tab === "history" ? <HistoryView state={hist.present} /> : null}

      <Tabs tab={tab} setTab={setTab} />
    </div>
  );
}
