import { useEffect, useRef } from "react";

const TRUSTED_FORM_IMG = "https://api.trustedform.com/ns.gif";
const TRUSTED_FORM_SCRIPT_ID = "trustedform-script";

const buildTrustedFormSrc = (formSelector: string): string => {
  const src = new URL("https://api.trustedform.com/trustedform.js");
  src.searchParams.set("field", "trustedFormCertUrl");
  src.searchParams.set("use_tagged_consent", "true");
  src.searchParams.set("form_selector", formSelector);
  src.searchParams.set("l", `${new Date().getTime() + Math.random()}`);

  src.searchParams.set("sandbox", "true");

  return src.toString();
};

interface TrustedFormScriptProps {
  programId?: string;
}

const TrustedFormScript = ({ programId }: TrustedFormScriptProps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) return;
    (window as unknown as { trustedFormNext?: () => void }).trustedFormNext?.();
  }, [programId]);

  useEffect(() => {
    isMounted.current = true;
    // TrustedForm sets an internal lock in JS memory that survives script tag removal.
    // Reloading the script after cleanup causes "Lock found" errors.
    // Solution: load once per page and never reload; trustedFormNext() handles new sessions.
    if (document.getElementById(TRUSTED_FORM_SCRIPT_ID)) {
      // Script already loaded from a previous mount — signal a new form session
      (window as unknown as { trustedFormNext?: () => void }).trustedFormNext?.();
      return;
    }
    const script = document.createElement("script");
    script.id = TRUSTED_FORM_SCRIPT_ID;
    script.type = "text/javascript";
    script.src = buildTrustedFormSrc("#rfi-form");
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <noscript>
      <img src={TRUSTED_FORM_IMG} alt="TrustedForm" />
    </noscript>
  );
};

export default TrustedFormScript;
