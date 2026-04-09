import { useState } from "react";
import { Program } from "@asd/domain";

import CheckMarkIcon from "../assets/svg/CheckMarkIcon";
import DegreeIcon from "../assets/svg/DegreeIcon";
import CampusIcon from "../assets/svg/CampusIcon";
import ProgramButton from "./ProgramButton";
import OnlineIcon from "../assets/svg/OnlineIcon";

import { useRFIStore } from "../store/rfiStore";


interface ProgramCardProps {
  program: Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const { addToQueue } = useRFIStore();
  const [expanded, setExpanded] = useState(false);

  const {
    clickTrackingUrl,
    degreeName,
    displayName,
    instructionMethod,
    programInfo,
    school,
  } = program;

  return (
    <div className="grid grid-cols-auto-fill-340 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col gap-4 transition-[transform,box-shadow] duration-200 ease-in-out cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white py-1 px-3 text-sm font-extrabold rounded-bl-lg uppercase tracking-[0.2em] uppercase shadow-lg z-10 flex items-center gap-1.5">
          <CheckMarkIcon />
          Accredited
        </div>
        <div className="p-6 pt-8 text-white bg-dark border-b-3 border-primary">
          <div className="text-muted mb-2 tracking-widest text-xs font-semibold uppercase">
            {school.displayName}
          </div>
          <div className="text-white text-2xl uppercase font-extrabold leading-tight">
            {displayName}
          </div>
        </div>
        <div className="p-6 grow flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50">
            <div className="flex-1 flex items-center gap-5">
              <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-700">
                <DegreeIcon />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {degreeName}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Degree
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px bg-slate-200 self-stretch my-2" />
            <div className="sm:hidden h-px w-full bg-slate-200" />
            <div className="flex-1 flex items-center gap-5">
              <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-700">
                {instructionMethod.toLowerCase().includes("online") ? <OnlineIcon/> : <CampusIcon />}
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {instructionMethod}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5">
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
            {programInfo && <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm font-semibold text-slate-600 border-b-2 border-slate-300 hover:text-primary hover:border-primary transition-all pb-0.5 hover:cursor-pointer"
            >
              {expanded ? "Show less" : "Read full description"}
            </button>}
          </div>
        </div>
        <div className="p-6 pt-0">
          <ProgramButton
            label={clickTrackingUrl ? "Learn More" : "Request Info"}
            url={clickTrackingUrl || undefined}
            onClick={
              clickTrackingUrl ? undefined : () => addToQueue(program)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
