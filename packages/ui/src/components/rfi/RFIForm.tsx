import { Program, RFIResponse } from "@asd/domain";
import { useRFISubmit } from "@asd/services";
import { useFormStore } from "../../store/formStore";
import { useRFIStore } from "../../store/rfiStore";
import RFIFormHeader from "./RFIFormHeader";
import RFIFormQuestions from "./RFIFormQuestions";
import RFIFormDisclaimers from "./RFIFormDisclaimers";
import ThirdPartyScript from "./scripts/ThirdPartyScripts";

interface RFIFormProps {
  response: RFIResponse;
  programs: Program[];
  onComplete: () => void;
  onProgramChange: (program: Program) => void;
  onProgramSkip: () => void;
}
const RFIForm = ({
  response,
  programs,
  onComplete,
  onProgramChange,
  onProgramSkip,
}: RFIFormProps) => {
  const {
    queue,
    currentProgram,
    setCurrentProgram,
    submitCurrent,
    skipCurrent,
  } = useRFIStore();
  const { formValues, setFieldErrors } = useFormStore();
  const { mutate } = useRFISubmit("www.test.com");

  return (
    <div>
      <RFIFormHeader
        displayName={response.displayName}
        schoolName={response.schoolName}
        logo={response.logo}
      />
      <div className="w-full sm:max-w-5xl sm:mx-auto px-0 sm:px-6 -mt-20 relative z-10 pb-24">
        <form
          className="bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
          id="rfi-form"
          onSubmit={(e) => {
            e.preventDefault();
            mutate(
              {
                programId: currentProgram?.programId ?? "",
                values: { ...formValues, band: currentProgram?.name ?? "" },
              },
              {
                onSuccess: (data) => {
                  if (Object.keys(data.fieldErrors).length === 0) {
                    submitCurrent();
                    if (queue.length <= 1) {
                      onComplete();
                    }
                  } else {
                    setFieldErrors(data.fieldErrors);
                  }
                },
              },
            );
          }}
        >
          <div className="p-8 md:p-10 lg:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  Request Information
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Fields marked with <span className="text-red-500">*</span> are
                  required.
                </p>
              </div>
              {programs?.length > 1 && (
                <select
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm cursor-pointer"
                  name="program"
                  value={currentProgram?.programId ?? ""}
                  onChange={(e) => {
                    const program = programs.find(
                      (p) => p.programId === e.target.value,
                    );
                    if (program) {
                      setCurrentProgram(program);
                      onProgramChange(program);
                    }
                  }}
                >
                  {programs.map((program) => (
                    <option key={program.programId} value={program.programId}>
                      {program.displayName}
                    </option>
                  ))}
                </select>
              )}
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
            <button
              type="button"
              onClick={() => {
                skipCurrent();

                if (queue.length <= 1) {
                  onComplete();
                } else {
                  onProgramSkip();
                }
              }}
            >
              Skip
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
