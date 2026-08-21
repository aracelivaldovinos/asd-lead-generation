"use client";

import { Listing, Program, RFIResponse } from "@asd/domain";
import RFIForm from "./RFIForm";
import ThankYouScreen from "../thankyou/ThankYouScreen";

export interface RFIFormConfig {
  response: RFIResponse | null;
  error?: string | null;
  submitUrl: string;
  isLoadingNext?: boolean;
  onComplete: () => void;
  onProgramChange: (program: Program) => void;
  onProgramSkip: (program: Program | null) => void;
}

interface RFIModalProps {
  isOpen: boolean;
  showThankYou?: boolean;
  listings: Listing[];
  rfi: RFIFormConfig;
  onClose: () => void;
}

const RFIModal = ({ isOpen, showThankYou, listings, rfi, onClose }: RFIModalProps) => {
  if (!isOpen && !showThankYou) return null;

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 text-2xl leading-none"
      aria-label="Close"
    >
      ✕
    </button>
  );

  if (showThankYou) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-7xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {closeButton}
          <div className="overflow-y-auto flex-1">
            <ThankYouScreen listings={listings} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full min-h-full">
        {closeButton}
        {rfi.response ? (
          <RFIForm
            response={rfi.response}
            submitUrl={rfi.submitUrl}
            isLoadingNext={rfi.isLoadingNext}
            onComplete={rfi.onComplete}
            onProgramChange={rfi.onProgramChange}
            onProgramSkip={rfi.onProgramSkip}
          />
        ) : rfi.error ? (
          <div className="flex items-center justify-center min-h-screen p-8">
            <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center flex flex-col gap-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <span className="text-red-500 text-2xl font-bold">!</span>
              </div>
              <p className="text-gray-900 text-xl font-bold">{rfi.error}</p>
              <p className="text-gray-500 text-sm">Please choose another program from the listings.</p>
              <button onClick={onClose} className="mt-2 bg-primary hover:bg-primaryHover text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200">
                Close
              </button>
            </div>
          </div>
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
