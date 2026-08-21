import { ThankYouLinkout } from "@asd/domain";
import ExternalIcon from "../../assets/svg/ExternalIcon";
import ExpandableText from "../ExpandableText";

interface ProgramListingCardProps {
  linkout: ThankYouLinkout;
}

const ProgramListingCard = ({ linkout }: ProgramListingCardProps) => {
  const { displayName, programInfo, clickTrackingUrl, school } = linkout;
  const initial = school.displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-3 py-4 rounded-lg border border-gray-200 bg-white">

      {/* Logo + content */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-50 flex items-center justify-center rounded-sm overflow-hidden">
          {school.logo.src ? (
            <img
              src={school.logo.src}
              alt={school.displayName}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-sm font-extrabold text-gray-500 text-center px-1">{initial}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 truncate">
            {school.displayName}
          </p>
          <p className="text-base font-bold text-gray-900 leading-snug mb-1">{displayName}</p>
          <ExpandableText html={programInfo} lines={2} />
        </div>
      </div>

      {/* Button — full width on mobile/tablet, auto on desktop */}
      <div className="flex-shrink-0 lg:pl-2">
        <a
          href={clickTrackingUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primaryHover text-white text-sm font-bold px-5 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap w-full lg:w-auto"
        >
          Learn More
          <ExternalIcon />
        </a>
      </div>

    </div>
  );
};

export default ProgramListingCard;
