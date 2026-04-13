import { groupRFIQuestions, RFIQuestion } from "@asd/domain";
import { useFormStore } from "../../store/formStore";

interface RFIFormQuestionsProps {
  questions: RFIQuestion[];
};

const GROUP_LABELS: Record<string, string> = {
  personal: "Personal Information",
  contact: "Contact Details",
  address: "Address Information",
  academic: "Academic Information",
  additional: "Additional Information",
};

const RFIFormQuestions = ({ questions }: RFIFormQuestionsProps) => {
  const { setFormValue, formValues, fieldErrors } = useFormStore();

  const grouped = groupRFIQuestions(questions);

  const renderQuestionField = (question: RFIQuestion) => {
    switch (question.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <input
            type={question.type}
            id={question.key}
            name={question.key}
            required={question.required}
            value={formValues[question.key] ?? ""}
            pattern={question.pattern ?? undefined}
            maxLength={question.maxLength}
            onChange={(e) => setFormValue(question.key, e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm placeholder-gray-400"
          />
        );
      case "select":
        return (
          <select
            name={question.key}
            id={question.key}
            required={question.required}
            value={formValues[question.key] ?? ""}
            onChange={(e) => setFormValue(question.key, e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 outline-none transition-all duration-200 shadow-sm cursor-pointer"
          >
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayName}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="flex gap-8">
            {question.options?.map((option) => {
              return (
                <div key={option.value}>
                  <input
                    type="radio"
                    id={`${question.key}-${option.value}`}
                    name={question.key}
                    value={option.value}
                    required={question.required}
                    className="items-center justify-center w-5 h-5 mr-3"
                    checked={formValues[question.key] === option.value}
                    onChange={(e) => setFormValue(question.key, e.target.value)}
                  />
                  <label className="text-sm font-medium text-gray-700" htmlFor={`${question.key}-${option.value}`}>
                    {option.displayName}
                  </label>
                </div>
              );
            })}
          </div>
        );
    }
  };
  return (
    <div>
      {Object.entries(grouped).map(
        ([group, questions]) =>
          questions.length > 0 && (
            <div key={group}>
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-5 flex items-center gap-2">
                {GROUP_LABELS[group]}
              </h3>
              {questions.map((question) => (
                <div key={question.key}>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                    htmlFor={question.key}
                  >
                    {question.title}
                  </label>
                  {renderQuestionField(question)}
                  {fieldErrors[question.key] && (
                    <span className="text-red-500">{fieldErrors[question.key]}</span>
                  )}
                </div>
              ))}
            </div>
          ),
      )}
    </div>
  );
};

export default RFIFormQuestions;
