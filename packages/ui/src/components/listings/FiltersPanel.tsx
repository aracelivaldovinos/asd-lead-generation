import { useState } from "react";
import { FiltersResponse, FilterQuestion } from "@asd/domain";

interface FiltersPanelProps {
  filters: FiltersResponse;
  onApply: (values: Record<string, string>) => void;
}

const FiltersPanel = ({ filters, onApply }: FiltersPanelProps) => {
  const [values, setValues] = useState<Record<string, string>>({});

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
          <div className="flex flex-col gap-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={filter.key}
                  value={option.value}
                  checked={values[filter.key] === option.value}
                  onChange={(e) => setValue(filter.key, e.target.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700">{option.displayName}</span>
              </label>
            ))}
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

  return (
    <div className="flex flex-wrap lg:flex-col gap-4 lg:gap-6">
      {Object.values(filters).map((filter) => (
        <div key={filter.key} className="w-full sm:w-auto sm:flex-1 lg:w-full lg:flex-none">
          <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor={filter.key}>
            {filter.title}
          </label>
          {renderFilter(filter)}
        </div>
      ))}
      <button
        onClick={() => onApply(values)}
        className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FiltersPanel;
