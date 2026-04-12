import { RFIQuestion, RFIResponse } from "@asd/domain";
import { useRFISubmit } from "@asd/services";
import { useFormStore } from "../store/formStore";
import { useRFIStore } from "../store/rfiStore";

interface RFIFormProps {
  response: RFIResponse;
}
const RFIForm = ({ response }: RFIFormProps) => {
  const { currentProgram, submitCurrent } = useRFIStore();
  const { setFormValue, formValues, fieldErrors, setFieldErrors } = useFormStore();
  const { mutate } = useRFISubmit("www.test.com");

  const { questions } = response;

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
          <div>
            {question.options?.map((option) => {
              return (
                <div key={option.value}>
                  <input
                    type="radio"
                    id={`${question.key}-${option.value}`}
                    name={question.key}
                    value={option.value}
                    required={question.required}
                    checked={formValues[question.key] === option.value}
                    onChange={(e) => setFormValue(question.key, e.target.value)}
                  />
                  <label htmlFor={`${question.key}-${option.value}`}>
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({programId: currentProgram?.programId ?? "", values: formValues}, {
          onSuccess: (data) => {
            if (Object.keys(data.fieldErrors).length === 0) {
              submitCurrent();
            } else {
              setFieldErrors(data.fieldErrors);
            }
          }
        })
      }}
    >
      {questions.map((question) => (
        <div key={question.key}>
          <label htmlFor={question.key}>{question.title}</label>
          {renderQuestionField(question)}
          {fieldErrors[question.key] && <span>{fieldErrors[question.key]}</span>}
        </div>
      ))}
      <button type="submit">Request Info</button>
    </form>
  );
};

export default RFIForm;
