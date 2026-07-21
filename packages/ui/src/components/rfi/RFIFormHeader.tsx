
interface RFIFormHeaderProps {
  displayName: string;
  schoolName: string;
}

const RFIFormHeader = ({displayName}: RFIFormHeaderProps) => {
  return (
    <header className="bg-dark relative">
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-32">
        <div className="max-w-3xl">
          <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {displayName}
          </div>
          <div className="text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed">
            Take the next step in your healthcare career. Request free information about our accredited sonography program today.
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-3 bg-primary shadow-[0_0_15px_rgba(255,107,0,0.5)]"></div>
    </header>
  )
};

export default RFIFormHeader;