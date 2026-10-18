// Tiny external store for avatar gaze telemetry. The canvas writes to it every frame it changes;
// only the components that display gaze data subscribe, so the rest of the page never re-renders.
import { useSyncExternalStore } from 'react';

let state = { angleDeg: 0, frameIndex: 0, isEyeContact: false, dist: 0 };
const listeners = new Set();

export const gazeStore = {
  get: () => state,
  set(next) {
    if (
      next.angleDeg === state.angleDeg &&
      next.frameIndex === state.frameIndex &&
      next.isEyeContact === state.isEyeContact
    ) return;
    state = next;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

export function useGaze() {
  return useSyncExternalStore(gazeStore.subscribe, gazeStore.get);
}
