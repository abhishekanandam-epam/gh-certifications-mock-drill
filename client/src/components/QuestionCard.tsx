import type { Question } from "../types";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selected: number[];
  onChange: (selected: number[]) => void;
  revealed: boolean;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  index,
  total,
  selected,
  onChange,
  revealed,
  disabled,
}: QuestionCardProps) {
  const isMultiSelect = question.correctAnswers.length > 1;

  function toggle(optionIdx: number) {
    if (disabled) return;
    if (isMultiSelect) {
      onChange(
        selected.includes(optionIdx)
          ? selected.filter((i) => i !== optionIdx)
          : [...selected, optionIdx].sort()
      );
    } else {
      onChange([optionIdx]);
    }
  }

  return (
    <div className="question-card">
      <div className="question-meta">
        Question {index + 1} of {total} &middot; {question.difficulty}
        {isMultiSelect && " · Choose all that apply"}
      </div>
      <h3 className="question-text">{question.question}</h3>
      <ul className="option-list">
        {question.options.map((option, i) => {
          const isChosen = selected.includes(i);
          const isCorrectOption = question.correctAnswers.includes(i);
          let stateClass = "";
          if (revealed) {
            if (isCorrectOption) stateClass = "option-correct";
            else if (isChosen && !isCorrectOption) stateClass = "option-incorrect";
          } else if (isChosen) {
            stateClass = "option-selected";
          }
          return (
            <li key={i}>
              <button
                type="button"
                className={`option-button ${stateClass}`}
                onClick={() => toggle(i)}
                disabled={disabled}
              >
                <span className="option-marker">{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && (
        <div className="explanation-box">
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}
