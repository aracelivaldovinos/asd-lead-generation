import LeadIdScripts from "./LeadIdScript";
import TrustedFormScript from "./TrustedFormScript";

interface ThirdPartyScriptProps {
  useLeadId: boolean;
  useTrustedForm: boolean;
  programId?: string;
}

const ThirdPartyScript = ({
  useLeadId,
  useTrustedForm,
  programId,
}: ThirdPartyScriptProps) => {
  return (
    <>
      {useLeadId && <LeadIdScripts programId={programId} />}
      {useTrustedForm && <TrustedFormScript programId={programId} />}
    </>
  );
};

export default ThirdPartyScript;
