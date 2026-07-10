import { useState } from "react";
import { PrefilterQuestion } from "@asd/domain";

type PrefilterVariant =
  | { variant?: "prefilter"; questions: PrefilterQuestion[] }
  | { variant: "single-dropdown"; question: PrefilterQuestion }
  | { variant: "button"; label: string };

export interface CTAConfig {
  title?: string;
  buttonLabel?: string;
}

type CTAProps = PrefilterVariant & {
  onSubmit: (values: Record<string, string>) => void;
  config?: CTAConfig;
};

const renderField = (
  question: PrefilterQuestion,
  value: string,
  onChange: (val: string) => void
) => {
  if (question.options) {
    return (
      <select
        id={question.key}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={question.required}
        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm cursor-pointer"
      >
        <option value="">Select...</option>
        {question.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.displayName}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={question.key}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={question.required}
      pattern={question.pattern ?? undefined}
      placeholder={question.title}
      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm"
    />
  );
};

const CTA = (props: CTAProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const title = props.variant !== "button" ? (props.config?.title ?? "Search for programs near you") : null;
  const buttonLabel = props.variant === "button" ? props.label : (props.config?.buttonLabel ?? "Find Schools");

  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  if (props.variant === "button") {
    return (
      <button
        onClick={() => props.onSubmit({})}
        className="inline-flex items-center justify-center bg-primary hover:bg-primaryHover text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 min-w-[360px]"
      >
        {props.label}
      </button>
    );
  }

  if (props.variant === "single-dropdown") {
    const { question } = props;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(values);
        }}
        className="flex flex-col gap-3"
      >
        {title && <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>}
        <label className="text-sm font-semibold text-gray-900" htmlFor={question.key}>
          {question.title}
        </label>
        <div className="flex flex-col min-[600px]:flex-row min-[600px]:items-center gap-3">
          <div className="min-[600px]:flex-1">
            {renderField(question, values[question.key] ?? "", (val) => setValue(question.key, val))}
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primaryHover text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 min-[600px]:min-w-[200px]"
          >
            {buttonLabel}
          </button>
        </div>
      </form>
    );
  }

  // default: "prefilter"
  const { questions } = props;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(values);
      }}
      className="flex flex-col gap-4"
    >
      {title && <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>}
      <div className="flex flex-col min-[600px]:flex-row gap-4">
        {questions.map((question) => (
          <div key={question.key} className="flex flex-col gap-2 min-[600px]:flex-1">
            <label className="text-sm font-semibold text-gray-900" htmlFor={question.key}>
              {question.title}
                </label>
            {renderField(question, values[question.key] ?? "", (val) => setValue(question.key, val))}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-primaryHover text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
      >
        {buttonLabel}
      </button>
    </form>
  );
};

export default CTA;
