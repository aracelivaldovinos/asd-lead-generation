import { useState } from "react";
import { Program } from "@asd/domain";

import CheckMarkIcon from "../assets/svg/CheckMarkIcon";
import DegreeIcon from "../assets/svg/DegreeIcon";
import CampusIcon from "../assets/svg/CampusIcon";
import ProgramButton from "./ProgramButton";
import OnlineIcon from "../assets/svg/OnlineIcon";

import { useRFIStore } from "../store/rfiStore";
import EnvelopeIcon from "../assets/svg/EnvelopeIcon";
import ExternalIcon from "../assets/svg/ExternalIcon";

interface ProgramCardProps {
  program: Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const { addToQueue, removeFromQueue, queue } = useRFIStore();
  const [expanded, setExpanded] = useState(false);

  const isSelected = queue.some((p) => p.programId === program.programId);

  const {
    clickTrackingUrl,
    degreeName,
    displayName,
    instructionMethod,
    programInfo,
    school,
  } = program;

  return (
    <div
      className={`bg-white rounded-xl border-2 flex flex-col gap-4 transition-all duration-200 ease-in-out cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] ${isSelected ? "border-primary shadow-[0_0_0_4px_rgba(255,107,0,0.1)]" : "border-gray-200"}`}
    >
      <div className="absolute top-0 right-0 bg-emerald-500 text-white py-1 px-3 text-sm font-extrabold rounded-bl-lg uppercase tracking-[0.2em] uppercase shadow-lg z-10 flex items-center gap-1.5">
        <CheckMarkIcon />
        Accredited
      </div>
      {isSelected && (
        <div className="absolute top-0 left-0 bg-primary text-white py-1 px-3 text-sm font-extrabold rounded-br-lg uppercase tracking-[0.2em] shadow-lg z-10 flex items-center gap-1.5">
          <CheckMarkIcon />
          Selected
        </div>
      )}
      <div className="p-6 pt-8 text-white bg-dark border-b-3 border-primary">
        <div className="text-muted mb-2 tracking-widest text-xs font-semibold uppercase">
          {school.displayName}
        </div>
        <div className="text-white text-xl sm:text-2xl uppercase font-extrabold leading-tight">
          {displayName}
        </div>
      </div>
      <div className="p-6 grow flex flex-col gap-6">
        <div className="flex flex-row gap-3 p-3 bg-slate-50">
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-700">
              <DegreeIcon />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 tracking-tight">
                {degreeName}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Degree
              </div>
            </div>
          </div>
          <div className="w-px bg-slate-200 self-stretch" />
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-700">
              {instructionMethod.toLowerCase().includes("online") ? (
                <OnlineIcon />
              ) : (
                <CampusIcon />
              )}
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 tracking-tight">
                {instructionMethod}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Format
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`text-sm text-slate-600 ${expanded ? "" : "line-clamp-3"}`}
            dangerouslySetInnerHTML={{ __html: programInfo }}
          />
          {programInfo && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm font-semibold text-slate-600 border-b-2 border-slate-300 hover:text-primary hover:border-primary transition-all pb-0.5 hover:cursor-pointer"
            >
              {expanded ? "Show less" : "Read full description"}
            </button>
          )}
        </div>
      </div>
      <div className="p-6 pt-0">
        {clickTrackingUrl ? (
          <ProgramButton
            label="Learn More"
            url={clickTrackingUrl}
            variant="outline"
            icon={<ExternalIcon />}
          />
        ) : (
          <ProgramButton
            label="Request Info"
            variant="primary"
            onClick={() => isSelected ? removeFromQueue(program.programId) : addToQueue(program)}
            icon={<EnvelopeIcon />}
          />
        )}
      </div>
    </div>
  );
};

export default ProgramCard;
