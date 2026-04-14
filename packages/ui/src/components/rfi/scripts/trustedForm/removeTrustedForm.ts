import { TrustedFormListenerMapValue } from "./TrustedFormListenerMapValue";

interface TrustedFormWindow extends Window {
  trustedFormNext?: () => void;
  trustedFormStopRecording?: () => void;
}

type TrustedFormListenerMap = Map<EventTarget, TrustedFormListenerMapValue>;

export function removeTrustedForm(
  window: TrustedFormWindow,
  document: Document,
  map: TrustedFormListenerMap,
  reset: () => void,
) {
  if (window?.trustedFormNext) {
    window?.trustedFormNext();
  }
  stopTrustedFormRecording(window);
  removeTrustedFormEventListeners(map, reset);
  removeTrustedFormGlobals(window);
  removeTrustedFormElements(document);
}

function removeTrustedFormEventListeners(
  map: TrustedFormListenerMap,
  reset: () => void,
) {
  map.forEach((listeners, element) => {
    listeners.forEach((info) => {
      element.removeEventListener(info.type, info.listener, info.options);
    });
  });
  reset();
}

function removeTrustedFormGlobals(window: Window) {
  removeGlobals(window, "trustedForm");
}

function removeTrustedFormElements(document: Document) {
  const selectors =
    'script[src*="trustedform.com"], link[href*="trustedform.com"], input[value*="trustedform.com"]';

  removeElements(document, selectors);
}

function removeElements(document: Document, selectors: string) {
  const elements = document.querySelectorAll(selectors);
  elements.forEach((element) => {
    element.parentElement?.removeChild(element);
  });
}

function removeGlobals(window: Window, keyToRemove: string) {
  const currentGlobals = Object.keys(window);
  const newGlobals = currentGlobals.filter((key) =>
    key.toLowerCase().includes(keyToRemove.toLowerCase()),
  );
  for (const globalName of newGlobals) {
    const win = window as unknown as Record<string, unknown>;
    if (win[globalName]) {
      delete win[globalName];
    }
  }
}

function stopTrustedFormRecording(window: TrustedFormWindow) {
  if (window.trustedFormStopRecording) {
    try {
      window?.trustedFormStopRecording();
    } catch (error) {
      console.error("after rfi submit", (error as Error).message);
    }
  }
}
