declare global {
  interface Window {
    ASD_SETTINGS?: {
      marketContext?: string;
      utm_medium?: string;
      utm_source?: string;
      utm_campaign?: string;
      utm_content?: string;
      cid?: string;
      pid?: string;
      KTID?: string;
    };
  }
}

function getUrlParam(name: string): string {
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

// Priority: ASD_SETTINGS → URL param
export function getAttribution() {
  const asd = window.ASD_SETTINGS ?? {};
  const pick = (key: keyof typeof asd) =>
    asd[key] || getUrlParam(key as string);

  return {
    marketContext: pick("marketContext"),
    utm_medium:    pick("utm_medium"),
    utm_source:    pick("utm_source"),
    utm_campaign:  pick("utm_campaign"),
    utm_content:   pick("utm_content"),
    cid:           pick("cid"),
    pid:           pick("pid"),
    KTID:          pick("KTID"),
  };
}
