import { isCallCenter } from "@asd/domain";
import { useEffect } from "react";

const SNIPPET_VERSION = "2";
const IMG_LAC = "672530C6-DE43-11E0-9EB4-12313D1C3D7C";
const CAMPAIGN_ID = "a3728d68-5fc2-462b-3e12-6aba6ec39385";
const CAMPAIGN_ID_CC = "8728cf05-abc7-dc18-385c-990b2410be07";

interface LeadIDWindow extends Window {
  LeadiD?: { destroy: () => void };
}

const buildLeadIdSrc = (cc: boolean): string => {
  const campaignId = cc ? CAMPAIGN_ID_CC : CAMPAIGN_ID;
  const src = new URL(`https://create.lidstatic.com/campaign/${campaignId}.js`);
  src.searchParams.set("snippet_version", SNIPPET_VERSION);
  if (cc) {
    src.searchParams.set("f", "reset");
  }
  return src.toString();
};

const buildLeadIdImg = (cc: boolean): string => {
  const campaignId = cc ? CAMPAIGN_ID_CC : CAMPAIGN_ID;
  const img = new URL("https://create.leadid.com/noscript.gif");
  img.searchParams.set("lac", IMG_LAC);
  img.searchParams.set("lck", campaignId);
  img.searchParams.set("snippet_version", SNIPPET_VERSION);
  return img.toString();
};

const removeLeadID = (window: LeadIDWindow) => {
  if (window?.LeadiD?.destroy) {
    window.LeadiD.destroy();
  }
};

const LeadIdScripts = () => {
  const cc = isCallCenter(new URLSearchParams(window.location.search));
  const src = buildLeadIdSrc(cc);
  const img = buildLeadIdImg(cc);

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "LeadiDscript_campaign";
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      removeLeadID(window as LeadIDWindow);
    };
  }, []);

  return (
    <noscript>
      <img src={img} alt="leadid" />
    </noscript>
  );
};

export default LeadIdScripts;
