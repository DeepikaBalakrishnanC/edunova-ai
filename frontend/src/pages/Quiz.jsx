import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import quizData from "../data/quizData";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const question = quizData[currentQuestion];

  const handleAnswer = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: option,
    });
  };

  const calculateScore = () => {
    let score = 0;

    quizData.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        score++;
      }
    });

    return score;
  };

  if (showResult) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8">
            Quiz Result
          </h1>

          <div className="bg-slate-900 p-10 rounded-3xl">
            <h2 className="text-4xl font-bold text-green-500">
              {calculateScore()} / {quizData.length}
            </h2>

            <p className="text-gray-400 mt-5">
              Congratulations! Quiz completed.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">
          Quiz
        </h1>

        <div className="bg-slate-900 p-8 rounded-3xl">
          <h2 className="text-3xl font-semibold mb-8">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 rounded-xl text-left transition ${
                  selectedAnswers[question.id] === option
                    ? "bg-blue-600"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-10">
            <button
              disabled={currentQuestion === 0}
              onClick={() =>
                setCurrentQuestion(currentQuestion - 1)
              }
              className="bg-gray-700 px-6 py-3 rounded-xl"
            >
              Previous
            </button>

            {currentQuestion === quizData.length - 1 ? (
              <button
                onClick={() => setShowResult(true)}
                className="bg-green-600 px-6 py-3 rounded-xl"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestion(currentQuestion + 1)
                }
                className="bg-blue-600 px-6 py-3 rounded-xl"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}