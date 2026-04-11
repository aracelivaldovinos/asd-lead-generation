import { RFIQuestion, RFIResponse } from "@asd/domain";

interface RFIFormProps {
  response: RFIResponse;
}
const RFIForm = ({ response }: RFIFormProps) => {
  const { questions } = response;

  const renderQuestionField = (question: RFIQuestion) => {
    switch (question.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <input type={question.type} id={question.key} name={question.key} />
        );
      case "select":
        return (
          <select name={question.key} id={question.key}>
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
                    type={question.type}
                    id={`${question.key}-${option.value}`}
                    name={question.key}
                    value={option.value}
                  />
                  <label htmlFor={`${question.key}-${option.value}`}>
                    {" "}
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
    <form>
      {questions.map((question) => (
        <div key={question.key}>
          <label htmlFor={question.key}>{question.title}</label>
          {renderQuestionField(question)}
        </div>
      ))}
      <button type="submit">Request Info</button>
    </form>
  );
};

export default RFIForm;
