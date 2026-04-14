import { RFIResponse } from "@asd/domain";
import { useRFISubmit } from "@asd/services";
import { useFormStore } from "../../store/formStore";
import { useRFIStore } from "../../store/rfiStore";
import RFIFormHeader from "./RFIFormHeader";
import RFIFormQuestions from "./RFIFormQuestions";
import RFIFormDisclaimers from "./RFIFormDisclaimers";
import ThirdPartyScript from "./scripts/ThirdPartyScripts";

interface RFIFormProps {
  response: RFIResponse;
}
const RFIForm = ({ response }: RFIFormProps) => {
  const { currentProgram, submitCurrent } = useRFIStore();
  const { formValues, setFieldErrors } = useFormStore();
  const { mutate } = useRFISubmit("www.test.com");

  return (
    <div>
      <RFIFormHeader
        displayName={response.displayName}
        schoolName={response.schoolName}
        logo={response.logo}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-24">
        <form
          className="bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
          id="rfi-form"
          onSubmit={(e) => {
            e.preventDefault();
            mutate(
              {
                programId: currentProgram?.programId ?? "",
                values: formValues,
              },
              {
                onSuccess: (data) => {
                  if (Object.keys(data.fieldErrors).length === 0) {
                    submitCurrent();
                  } else {
                    setFieldErrors(data.fieldErrors);
                  }
                },
              },
            );
          }}
        >
          <div className="p-8 md:p-10 lg:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-8">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  Request Information
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Fields marked with <span className="text-red-500">*</span> are
                  required.
                </p>
              </div>
            </div>
            <RFIFormQuestions questions={response.questions} />
            {(response.disclaimer || response.tcpaDisclaimer) && (
              <RFIFormDisclaimers
                captureConsent={response.useLeadId || response.useTrustedForm}
                disclaimer={response.disclaimer}
                tcpaDisclaimer={response.tcpaDisclaimer}
                tcpaCheckboxRequired={response.tcpaCheckboxRequired}
              />
            )}
            <button
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primaryHover text-white text-xl font-bold py-5 px-8 rounded-xl tracking-wide shadow-[0_8px_20px_-6px_rgba(255,107,0,0.6)] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary/30"
              type="submit"
            >
              Request Information
            </button>
          </div>
        </form>
      </div>
      {(response.useLeadId || response.useTrustedForm) && (
        <ThirdPartyScript
          useLeadId={response.useLeadId}
          useTrustedForm={response.useTrustedForm}
        />
      )}
    </div>
  );
};

export default RFIForm;
