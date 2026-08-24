import { useState, useRef, useEffect } from "react";

interface ExpandableTextProps {
  html: string;
  lines?: number;
}

const ExpandableText = ({ html, lines = 3 }: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight);
  }, [html]);

  if (!html) return null;

  return (
    <div>
      <div
        ref={ref}
        className={`asd-program-card-desc text-sm text-slate-600 ${expanded ? "" : `line-clamp-${lines}`}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {isClamped && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="text-sm font-semibold text-slate-600 border-b-2 border-slate-300 hover:text-primary hover:border-primary transition-all pb-0.5 hover:cursor-pointer"
        >
          {expanded ? "Show less" : "Read full description"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
