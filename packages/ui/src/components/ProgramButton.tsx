import { ReactNode } from "react";

interface ProgramButtonProps {
  label: string;
  url?: string;
  onClick?: () => void | undefined;
  icon?: ReactNode;
}

const ProgramButton = ({ label, url, onClick, icon }: ProgramButtonProps) => {
  const className =
    "inline-block bg-primary text-white py-4 px-6 no-underline uppercase font-extrabold text-sm tracking-[0.5px] border-none rounded-[6px] cursor-pointer transition-colors duration-200 ease-in-out text-center w-full hover:bg-primary-hover";
  return (
    <>
      {url ? (
        <a className={className} href={url} target="_blank" rel="noreferrer">
          {label}
          {icon}
        </a>
      ) : (
        <button className={className} onClick={onClick}>
          {label}
          {icon}
        </button>
      )}
    </>
  );
};

export default ProgramButton;
