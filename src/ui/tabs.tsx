import React from "react";

export type TabKey = "table" | "deck" | "history";

export function Tabs(props: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
}) {
  const { tab, setTab } = props;

  const btn = (key: TabKey, label: string) => {
    const cls = `tab_btn ${tab === key ? "tab_btn_active" : ""}`;
    return (
      <button className={cls} onClick={() => setTab(key)} type="button">
        {label}
      </button>
    );
  };

  return (
    <div className="bottom_nav">
      <div className="bottom_nav_inner">
        {btn("table", "Table")}
        {btn("deck", "Deck")}
        {btn("history", "History")}
      </div>
    </div>
  );
}
