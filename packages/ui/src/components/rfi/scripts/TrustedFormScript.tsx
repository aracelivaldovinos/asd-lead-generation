import { useEffect, useRef } from "react";
import { removeTrustedForm } from "./trustedForm/removeTrustedForm";
import { useTrustedFormListeners } from "./trustedForm/useTrustedFormListeners";
import { usePatchedEventListener } from "./trustedForm/usePatchedEventListener";
import { TrustedFormListenerMapValue } from "./trustedForm/TrustedFormListenerMapValue";

const TRUSTED_FORM_IMG = "https://api.trustedform.com/ns.gif";

const buildTrustedFormSrc = (formSelector: string): string => {
  const src = new URL("https://api.trustedform.com/trustedform.js");
  src.searchParams.set("field", "trustedFormCertUrl");
  src.searchParams.set("use_tagged_consent", "true");
  src.searchParams.set("form_selector", formSelector);
  src.searchParams.set("l", `${new Date().getTime() + Math.random()}`);

  if (!import.meta.env.MODE) {
    src.searchParams.set("sandbox", "true");
  }

  return src.toString();
};

const TrustedFormScript = () => {
  const [listeners, add, reset] = useTrustedFormListeners();
  usePatchedEventListener(add);
  const listenersRef =
    useRef<Map<EventTarget, TrustedFormListenerMapValue>>(listeners);
  listenersRef.current = listeners;

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "trustedform-script";
    script.type = "text/javascript";
    script.src = buildTrustedFormSrc("#rfi-form");
    script.async = true;
    document.head.appendChild(script);

    return () => {
      removeTrustedForm(window, document, listenersRef.current, reset);
    };
  }, []);

  return (
    <noscript>
      <img src={TRUSTED_FORM_IMG} alt="TrustedForm" />
    </noscript>
  );
};

export default TrustedFormScript;
