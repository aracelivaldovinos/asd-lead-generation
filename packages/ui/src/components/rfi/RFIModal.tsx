"use client";

import { Program, RFIResponse } from "@asd/domain";
import RFIForm from "./RFIForm";

interface RFIModalProps {
  isOpen: boolean;
  rfiResponse: RFIResponse | null;
  programs: Program[];
  submitUrl: string;
  onClose: () => void;
  onProgramChange: (program: Program) => void;
  onProgramSkip: () => void;
}

const RFIModal = ({
  isOpen,
  rfiResponse,
  programs,
  submitUrl,
  onClose,
  onProgramChange,
  onProgramSkip,
}: RFIModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full min-h-full">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 text-2xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>
        {rfiResponse ? (
          <RFIForm
            response={rfiResponse}
            programs={programs}
            submitUrl={submitUrl}
            onComplete={onClose}
            onProgramChange={onProgramChange}
            onProgramSkip={onProgramSkip}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFIModal;
