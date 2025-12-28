export type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function makeHistory<T>(initial: T): HistoryState<T> {
  return { past: [], present: initial, future: [] };
}

export function push<T>(h: HistoryState<T>, next: T): HistoryState<T> {
  return { past: [...h.past, h.present], present: next, future: [] };
}

export function undo<T>(h: HistoryState<T>): HistoryState<T> {
  if (h.past.length === 0) return h;
  const prev = h.past[h.past.length - 1];
  return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future] };
}

export function redo<T>(h: HistoryState<T>): HistoryState<T> {
  if (h.future.length === 0) return h;
  const next = h.future[0];
  return { past: [...h.past, h.present], present: next, future: h.future.slice(1) };
}
