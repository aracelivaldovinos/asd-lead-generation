import { ReactNode } from "react";

interface ProgramButtonProps {
  label: string;
  url?: string;
  onClick?: () => void | undefined;
  icon?: ReactNode;
  variant?: "primary" | "outline";
}

const ProgramButton = ({ label, url, onClick, icon, variant = "primary" }: ProgramButtonProps) => {
  const className =
    variant === "outline"
      ? "inline-flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-300 py-4 px-6 no-underline uppercase font-extrabold text-sm tracking-[0.5px] rounded-[6px] cursor-pointer transition-colors duration-200 ease-in-out text-center w-full hover:border-gray-400 hover:text-gray-900"
      : "inline-flex items-center justify-center gap-2 bg-primary text-white py-4 px-6 no-underline uppercase font-extrabold text-sm tracking-[0.5px] border-none rounded-[6px] cursor-pointer transition-colors duration-200 ease-in-out text-center w-full hover:bg-primary-hover";
  return (
    <>
      {url ? (
        <a className={className} href={url} target="_blank" rel="noreferrer">
          {icon}
          {label}
        </a>
      ) : (
        <button className={className} onClick={onClick}>
          {icon}
          {label}
        </button>
      )}
    </>
  );
};

export default ProgramButton;
