import { useState } from "react";
import { Program, RFIResponse, PRIVACY_POLICY } from "@asd/domain";
import { useRFISubmit } from "@asd/services";
import { useFormStore } from "../../store/formStore";
import { useShallow } from "zustand/react/shallow";
import { useRFIStore, selectSchoolPrograms } from "../../store/rfiStore";
import RFIFormHeader from "./RFIFormHeader";
import RFIFormQuestions from "./RFIFormQuestions";
import RFIFormDisclaimers from "./RFIFormDisclaimers";
import ThirdPartyScript from "./scripts/ThirdPartyScripts";
import Modal from "../modal/Modal";

interface RFIFormProps {
  response: RFIResponse;
  submitUrl: string;
  onComplete: () => void;
  onProgramChange: (program: Program) => void;
  onProgramSkip: () => void;
}
const RFIForm = ({
  response,
  submitUrl,
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
  const schoolPrograms = useRFIStore(useShallow(selectSchoolPrograms));
  const { formValues, setFieldErrors } = useFormStore();
  const { mutate } = useRFISubmit(submitUrl);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div>
      <RFIFormHeader
        displayName={response.displayName}
        schoolName={response.schoolName}
      />
      <div className="w-full sm:max-w-5xl sm:mx-auto px-0 sm:px-6 -mt-20 relative z-10 pb-24">
        <form
          className="bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
          id="rfi-form"
          onSubmit={(e) => {
            e.preventDefault();
            const merged = { ...formValues };
            for (const question of response.questions) {
              if ((question.type === "select" || question.type === "radio") && merged[question.key] === undefined && question.options?.[0]) {
                merged[question.key] = question.options[0].value;
              }
            }
            const custom: Record<string, string> = {};
            const rest: Record<string, string> = {};
            for (const [key, value] of Object.entries(merged)) {
              const match = key.match(/^custom\[(\d+)\]$/);
              if (match) {
                custom[match[1]] = value;
              } else {
                rest[key] = value;
              }
            }
            mutate(
              {
                programId: currentProgram?.programId ?? "",
                values: { ...rest, ...(Object.keys(custom).length > 0 && { custom }), band: currentProgram?.name ?? "", selection: "selected" },
              },
              {
                onSuccess: (data) => {
                  if (Object.keys(data.fieldErrors).length === 0) {
                    submitCurrent();
                    onComplete();
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
              <div className="flex items-center justify-between gap-4 w-full">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    Request Information
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Fields marked with <span className="text-red-500">*</span> are
                    required.
                  </p>
                </div>
                {response.logo && (
                  <img
                    src={response.logo.src}
                    width={response.logo.width}
                    height={response.logo.height}
                    alt={response.schoolName}
                    className="max-h-16 max-w-[160px] object-contain"
                  />
                )}
              </div>
              {schoolPrograms.length > 1 && (
                <select
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm cursor-pointer"
                  name="program"
                  value={currentProgram?.programId ?? ""}
                  onChange={(e) => {
                    const program = schoolPrograms.find(
                      (p) => p.programId === e.target.value,
                    );
                    if (program) {
                      setCurrentProgram(program);
                      onProgramChange(program);
                    }
                  }}
                >
                  {schoolPrograms.map((program) => (
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
            {queue.length > 1 && (
              <button
                type="button"
                className="w-full flex items-center gap-4 mt-4 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 text-left"
                onClick={() => {
                  skipCurrent();
                  onProgramSkip();
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Not interested in {currentProgram?.displayName}?</p>
                  <p className="text-sm font-bold text-gray-900 truncate">Skip to {queue[1]?.displayName}</p>
                </div>
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )}
            <p className="text-center mt-4">
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="text-sm text-primary underline"
              >
                Show Privacy Policy
              </button>
            </p>
          </div>
        </form>
        <Modal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
          <div dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY }} />
        </Modal>
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
