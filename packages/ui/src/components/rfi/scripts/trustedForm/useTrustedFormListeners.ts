import { useCallback, useState } from "react";
import { TrustedFormListenerMapValue } from "./TrustedFormListenerMapValue";

export const useTrustedFormListeners = () => {
  const [listeners, setListeners] = useState(
    new Map<EventTarget, TrustedFormListenerMapValue>(),
  );

  const add = useCallback(
    (
      eventTarget: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) => {
      const stackTrace = new Error().stack || "";
      if (stackTrace.includes("trustedform.com")) {
        setListeners((prevMap) => {
          const newMap = new Map(prevMap);
          if (!newMap.has(eventTarget)) {
            newMap.set(eventTarget, []);
          }
          newMap.get(eventTarget)!.push({ type, listener, options });

          return newMap;
        });
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setListeners(new Map<EventTarget, TrustedFormListenerMapValue>());
  }, []);

  return [listeners, add, reset] as const;
};
