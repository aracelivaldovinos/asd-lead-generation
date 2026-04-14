import { useEffect } from 'react';

type AddEventListener = (
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
) => void;
type PatchableFunction = typeof EventTarget.prototype.addEventListener & Record<symbol, boolean>;

export function usePatchedEventListener(
    add: AddEventListener,
    id: string = 'isPatched',
) {
    useEffect(() => {
        const original = EventTarget.prototype.addEventListener as PatchableFunction;
        const isPatchedSymbol = Symbol(id);

        if (!(original)[isPatchedSymbol]) {
            EventTarget.prototype.addEventListener = function (
                this: EventTarget,
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | AddEventListenerOptions,
            ) {
                add(this, type, listener, options);
                original.call(this, type, listener, options);
            };

            (original)[isPatchedSymbol] = true;
        }

        return () => {
            EventTarget.prototype.addEventListener = original;
        };
    }, []);
}
