interface RFIFormDisclaimersProps {
  captureConsent: boolean;
  disclaimer: string;
  tcpaDisclaimer: string;
  tcpaCheckboxRequired: boolean;
}

const RFIFormDiclaimers = ({
  captureConsent,
  disclaimer,
  tcpaDisclaimer,
  tcpaCheckboxRequired,
}: RFIFormDisclaimersProps) => {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col gap-3 hover:border-gray-300 transition-colors">
      {tcpaDisclaimer && (
        <div className="flex items-start gap-4">
          <div className="flex items-center h-5 mt-0.5">
            {tcpaCheckboxRequired ? (
              <input
                className="w-5 h-5 bg-white rounded cursor-pointer"
                type="checkbox"
                id="leadid_tcpa_disclosure"
                name="consent"
                value="yes"
                aria-hidden={true}
                data-tf-element-role="consent-opt-in"
                required={tcpaCheckboxRequired}
                autoComplete="off"
              />
            ) : captureConsent ? (
              <input
                type="hidden"
                id="leadid_tcpa_disclosure"
                name="consent"
                value="yes"
              />
            ) : null}
          </div>
          <label
            htmlFor="leadid_tcpa_disclosure"
            className="text-sm text-gray-600 leading-relaxed cursor-pointer"
          >
            {tcpaDisclaimer}
          </label>
        </div>
      )}
      {disclaimer && (
        <div
          className="text-sm text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: disclaimer }}
        />
      )}
    </div>
  );
};

export default RFIFormDiclaimers;
