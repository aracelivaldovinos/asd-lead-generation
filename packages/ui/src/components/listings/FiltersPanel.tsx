import { useState } from "react";
import { FiltersResponse, FilterQuestion } from "@asd/domain";

interface FiltersPanelProps {
  filters: FiltersResponse;
  values: Record<string, string>;
  onApply: (values: Record<string, string>) => void;
  onClose?: () => void;
}

const FiltersPanel = ({ filters, values: initialValues, onApply, onClose }: FiltersPanelProps) => {
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderFilter = (filter: FilterQuestion) => {
    switch (filter.type) {
      case "input":
        return (
          <input
            type="text"
            id={filter.key}
            value={values[filter.key] ?? ""}
            pattern={filter.pattern}
            placeholder={filter.title}
            onChange={(e) => setValue(filter.key, e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm"
          />
        );
      case "radio":
        return (
          <div className="flex gap-2">
            {filter.options?.map((option) => {
              const isSelected = values[filter.key] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue(filter.key, option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    isSelected
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                  }`}
                >
                  {option.displayName}
                </button>
              );
            })}
          </div>
        );
      case "select":
        return (
          <select
            id={filter.key}
            value={values[filter.key] ?? ""}
            onChange={(e) => setValue(filter.key, e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm cursor-pointer"
          >
            <option value="">All</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayName}
              </option>
            ))}
          </select>
        );
      case "range":
        return (
          <div className="flex flex-col gap-2">
            <input
              type="range"
              id={filter.key}
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={values[filter.key] ?? filter.min ?? 0}
              onChange={(e) => setValue(filter.key, e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{filter.min} mi</span>
              <span className="font-semibold text-gray-900">{values[filter.key] ?? filter.min ?? 0} mi</span>
              <span>Everywhere</span>
            </div>
          </div>
        );
    }
  };

  const selectedSubjectArea = filters.subjectArea.options?.find(
    (o) => o.value === values["subjectArea"]
  );
  const specializationOptions = selectedSubjectArea?.specializations ?? [];

  return (
    <div className="flex flex-col gap-2">
      {onClose && (
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Filters</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {Object.values(filters).map((filter) => {
        const isSpecialization = filter.key === "specialization";
        const isDisabled = isSpecialization && specializationOptions.length === 0;
        const resolvedFilter = isSpecialization
          ? { ...filter, options: specializationOptions }
          : filter;
        return (
          <div key={resolvedFilter.key} className={`pb-4 ${isDisabled ? "opacity-50" : ""}`}>
            <label className={`block text-sm font-semibold text-gray-900 pb-2 mb-3 ${resolvedFilter.key !== "postalCode" ? "border-t border-gray-200 pt-3" : ""}`} htmlFor={resolvedFilter.key}>
              {resolvedFilter.title}
            </label>
            {isDisabled ? (
              <select
                id={resolvedFilter.key}
                disabled
                className="w-full bg-white border border-gray-300 text-gray-400 text-sm rounded-lg block p-3 outline-none shadow-sm cursor-not-allowed"
              >
                <option>Select a field of study first</option>
              </select>
            ) : (
              renderFilter(resolvedFilter)
            )}
          </div>
        );
      })}
      <button
        onClick={() => {
          onApply(values);
          onClose?.();
        }}
        className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FiltersPanel;
