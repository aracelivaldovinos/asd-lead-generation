import { PREPPED_FOR_SUCCESS_QUESTIONS } from "@asd/domain";

const PreppedForSuccess = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 tracking-widest uppercase">
          Are You Prepped for Success?
        </h2>
      </div>

      {/* Content */}
      <div className="px-6 py-6 overflow-y-auto flex-1">
        {/* Large heading with green underline */}
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold text-dark leading-tight uppercase mb-3">
            {PREPPED_FOR_SUCCESS_QUESTIONS.length} Questions to Ask<br />Before Enrolling
          </h3>
        </div>

        {/* Questions */}
        <ol className="flex flex-col">
          {PREPPED_FOR_SUCCESS_QUESTIONS.map((q, i) => (
            <li key={i} className="flex gap-4">
              {/* Stepper column */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-blue-50 text-blue-500">
                  {i + 1}
                </div>
                {i < PREPPED_FOR_SUCCESS_QUESTIONS.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 my-1" />
                )}
              </div>
              {/* Content */}
              <div className={i < PREPPED_FOR_SUCCESS_QUESTIONS.length - 1 ? "pb-6" : ""}>
                <p className="text-sm font-bold text-gray-900 mt-2">{q.title}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{q.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PreppedForSuccess;
