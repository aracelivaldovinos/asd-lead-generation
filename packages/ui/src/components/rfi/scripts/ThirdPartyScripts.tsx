import LeadIdScripts from "./LeadIdScript";
import TrustedFormScript from "./TrustedFormScript";

interface ThirdPartyScriptProps {
  useLeadId: boolean;
  useTrustedForm: boolean;
}

const ThirdPartyScript = ({
  useLeadId,
  useTrustedForm,
}: ThirdPartyScriptProps) => {
  return (
    <>
      {useLeadId && <LeadIdScripts />}
      {useTrustedForm && <TrustedFormScript />}
    </>
  );
};

export default ThirdPartyScript;
