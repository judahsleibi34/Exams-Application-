import { useEffect, useState } from "react";
import "./App.css";

type Screen = "landing" | "exam" | "results";

type Question = {
  id: number;
  topic: string;
  text: string;
  options: string[];
  correct: number;
};

// CHANGE THIS VALUE TO SET THE EXAM DURATION
const EXAM_MINUTES = 20;

// Sample Urology questions — replace with your question bank.
const QUESTIONS: Question[] = [
  {
    id: 1,
    topic: "Anatomy",
    text: "Which structure carries urine from the kidney to the urinary bladder?",
    options: ["Urethra", "Ureter", "Renal artery", "Nephron"],
    correct: 1,
  },
  {
    id: 2,
    topic: "Physiology",
    text: "What is the functional unit of the kidney?",
    options: ["Glomerulus", "Nephron", "Ureter", "Renal pelvis"],
    correct: 1,
  },
  {
    id: 3,
    topic: "Urolithiasis",
    text: "Which is the most common composition of kidney stones?",
    options: ["Cystine", "Struvite", "Calcium oxalate", "Uric acid"],
    correct: 2,
  },
  {
    id: 4,
    topic: "Terminology",
    text: "What term describes blood in the urine?",
    options: ["Hematuria", "Proteinuria", "Pyuria", "Glycosuria"],
    correct: 0,
  },
  {
    id: 5,
    topic: "Anatomy",
    text: "Where is the prostate gland located?",
    options: [
      "Above the kidneys",
      "Within the scrotum",
      "Below the bladder, around the proximal urethra",
      "Inside the ureter",
    ],
    correct: 2,
  },
  {
    id: 6,
    topic: "Imaging",
    text: "Which imaging method does not use ionizing radiation to assess hydronephrosis?",
    options: ["CT", "Plain X-ray", "Fluoroscopy", "Ultrasonography"],
    correct: 3,
  },
  {
    id: 7,
    topic: "Lower urinary tract",
    text: "What does urinary retention mean?",
    options: [
      "Excessive urine production",
      "Inability to empty the bladder adequately",
      "Blood in urine",
      "Pain during urination",
    ],
    correct: 1,
  },
  {
    id: 8,
    topic: "Diagnostics",
    text: "Which test measures the rate of urine flow during voiding?",
    options: ["Uroflowmetry", "Cystoscopy", "Urine culture", "Renal biopsy"],
    correct: 0,
  },
  {
    id: 9,
    topic: "Physiology",
    text: "Which muscle contracts to empty the urinary bladder?",
    options: ["Diaphragm", "External oblique", "Detrusor", "Psoas major"],
    correct: 2,
  },
  {
    id: 10,
    topic: "Anatomy",
    text: "Which structure carries urine from the bladder out of the body?",
    options: ["Ureter", "Renal pelvis", "Collecting duct", "Urethra"],
    correct: 3,
  },
];

const TOTAL = QUESTIONS.length;
const DURATION_SECONDS = EXAM_MINUTES * 60;

function formatTime(seconds: number) {
  return (
    String(Math.floor(seconds / 60)).padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0")
  );
}

const primary =
  "rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40";

const secondary =
  "rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [remaining, setRemaining] = useState(DURATION_SECONDS);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Timer remains accurate when the application loses focus.
  useEffect(() => {
    if (screen !== "exam" || deadline === null) return;

    const update = () => {
      setRemaining(
        Math.max(0, Math.ceil((deadline - performance.now()) / 1000))
      );
    };

    update();

    const interval = window.setInterval(update, 250);

    return () => window.clearInterval(interval);
  }, [screen, deadline]);

  // Automatic submission when time expires.
  useEffect(() => {
    if (screen === "exam" && remaining === 0) {
      setTimedOut(true);
      setConfirmOpen(false);
      setOverviewOpen(false);
      setScreen("results");
    }
  }, [remaining, screen]);

  const question = QUESTIONS[index];

  const answered = QUESTIONS.filter(
    (q) => answers[q.id] !== undefined
  ).length;

  const score = QUESTIONS.filter(
    (q) => answers[q.id] === q.correct
  ).length;

  function openQuestion(n: number) {
    setIndex(n);
    setOverviewOpen(false);
  }

  function submit() {
    setConfirmOpen(false);
    setOverviewOpen(false);
    setScreen("results");
  }

  function start() {
    setRemaining(DURATION_SECONDS);
    setDeadline(performance.now() + DURATION_SECONDS * 1000);
    setScreen("exam");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* APPLICATION HEADER */}
      <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-9">
        <div>
          <div className="text-lg font-bold tracking-tight">
            Urology MCQ Exam
          </div>
          <div className="text-xs text-slate-500">
            Desktop assessment platform
          </div>
        </div>

        {screen === "exam" ? (
          <div className="flex items-center gap-5 text-sm">
            <span className="hidden text-slate-500 sm:block">
              Question {index + 1} of {TOTAL}
            </span>
            <strong className={
              remaining <= 60
                ? "text-red-700 tabular-nums"
                : "tabular-nums"
            }>
              Time left: {formatTime(remaining)}
            </strong>
          </div>
        ) : (
          <span className="text-sm text-slate-500">
            {screen === "landing" ? "Ready" : "Submitted"}
          </span>
        )}
      </header>

      {/* LANDING PAGE */}
      {screen === "landing" && (
        <main className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-9">

          <section className="flex min-h-[440px] flex-col items-start justify-center border border-slate-200 bg-white px-8 py-12 lg:px-16">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-700">
              Assessment
            </div>

            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Urology MCQ Exam
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Ten questions, one at a time. Navigate freely between
              questions before submitting your final answers.
            </p>

            <button className={`${primary} mt-7`} onClick={start}>
              Start exam →
            </button>
          </section>

          <aside className="border border-slate-200 bg-white p-7">
            <h2 className="mb-5 text-lg font-bold">
              Exam information
            </h2>

            {[
              ["Questions", String(TOTAL)],
              ["Time limit", `${EXAM_MINUTES} minutes`],
              ["Question type", "Single-choice MCQ"],
              ["Navigation", "Previous / Next"],
              ["Retakes", "Not available"],
            ].map(([label, value]) => (
              <div
                className="flex justify-between gap-4 border-b border-slate-100 py-4 text-sm"
                key={label}
              >
                <span className="text-slate-500">{label}</span>
                <strong className="text-right">{value}</strong>
              </div>
            ))}

            <p className="mt-6 text-sm leading-6 text-slate-500">
              The timer starts when you press Start exam.
              Unanswered questions receive zero marks, and
              submission is final.
            </p>
          </aside>
        </main>
      )}

      {/* EXAM SCREEN — ONE QUESTION AT A TIME */}
      {screen === "exam" && (
        <main className="px-5 py-6 lg:px-9">

          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Urology assessment
              </div>

              <h1 className="mt-1 text-2xl font-bold">
                Question {index + 1}
                <span className="font-normal text-slate-400">
                  {" "} / {TOTAL}
                </span>
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              Select one answer. You may change it before submission.
            </p>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">

            {/* QUESTION WORKSPACE */}
            <section className="flex min-h-[max(540px,calc(100vh-190px))] flex-col border border-slate-200 bg-white p-6 lg:p-9">

              <div className="flex justify-between border-b border-slate-200 pb-5 text-sm">
                <span className="font-semibold text-blue-700">
                  {question.topic}
                </span>

                <span className="text-slate-500">
                  {answers[question.id] !== undefined
                    ? "Answered"
                    : "Not answered"}
                </span>
              </div>

              <fieldset className="mt-7 min-w-0 border-0 p-0">
                <legend className="mb-7 w-full text-xl font-semibold leading-snug lg:text-[27px]">
                  {question.text}
                </legend>

                <div className="grid gap-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex min-h-[68px] cursor-pointer items-center gap-4 rounded-md border p-4 text-[15px] hover:border-blue-300 ${
                        answers[question.id] === optionIndex
                          ? "border-blue-700 bg-blue-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <input
                        className="h-4 w-4 accent-blue-700"
                        type="radio"
                        name={`question-${question.id}`}
                        checked={answers[question.id] === optionIndex}
                        onChange={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [question.id]: optionIndex,
                          }))
                        }
                      />

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>

                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* PREVIOUS / NEXT CONTROLS */}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                <span className="text-xs text-slate-500">
                  Answers are retained when you change questions.
                </span>

                <div className="flex gap-2">
                  <button
                    className={secondary}
                    onClick={() => openQuestion(index - 1)}
                    disabled={index === 0}
                  >
                    ← Previous
                  </button>

                  {index === TOTAL - 1 ? (
                    <button
                      className={primary}
                      onClick={() => setConfirmOpen(true)}
                    >
                      Submit exam
                    </button>
                  ) : (
                    <button
                      className={primary}
                      onClick={() => openQuestion(index + 1)}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* EXAM PROGRESS SIDEBAR */}
            <aside className="border border-slate-200 bg-white lg:sticky lg:top-[92px]">

              {/* TIMER */}
              <div className="border-b border-slate-200 p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Time remaining
                </div>

                <div className={`mt-2 text-4xl font-bold tracking-tight tabular-nums ${
                  remaining <= 60 ? "text-red-700" : ""
                }`}>
                  {formatTime(remaining)}
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden bg-slate-100">
                  <div
                    className="h-full bg-slate-500"
                    style={{
                      width: `${(remaining / DURATION_SECONDS) * 100}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Automatic submission at 00:00
                </p>
              </div>

              {/* PROGRESS */}
              <div className="border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Exam progress</h2>
                  <strong className="text-blue-700">
                    {answered} / {TOTAL}
                  </strong>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden bg-slate-100">
                  <div
                    className="h-full bg-blue-700"
                    style={{
                      width: `${(answered / TOTAL) * 100}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {TOTAL - answered} questions unanswered
                </p>

                {/* CLICKABLE QUESTION NAVIGATION */}
                <div className="mt-6 grid grid-cols-5 gap-2">
                  {QUESTIONS.map((item, n) => (
                    <button
                      key={item.id}
                      aria-current={n === index ? "step" : undefined}
                      aria-label={`Go to question ${n + 1}`}
                      onClick={() => openQuestion(n)}
                      className={`aspect-square min-h-[44px] rounded border text-sm font-semibold ${
                        answers[item.id] !== undefined
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      } ${
                        n === index
                          ? "outline-2 outline-offset-2 outline-slate-700"
                          : ""
                      }`}
                    >
                      {n + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="mt-5 text-sm font-semibold text-blue-700 hover:underline"
                  onClick={() => setOverviewOpen(true)}
                >
                  Expand question overview →
                </button>
              </div>

              <div className="p-6">
                <button
                  className={`${primary} w-full`}
                  onClick={() => setConfirmOpen(true)}
                >
                  Submit exam
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">
                  Final submission. No retakes.
                </p>
              </div>
            </aside>
          </div>
        </main>
      )}

      {/* RESULTS SCREEN */}
      {screen === "results" && (
        <main className="p-6 lg:p-9">

          <section className="flex flex-wrap items-center justify-between gap-5 border border-slate-200 bg-white p-7">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-700">
                Assessment complete
              </div>

              <h1 className="text-2xl font-bold">
                {timedOut
                  ? "Time expired — exam submitted"
                  : "Exam submitted"}
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Your submission is final. No retakes are available.
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-500">
                Final score
              </div>

              <div className="text-5xl font-bold tabular-nums text-blue-700">
                {score}
                <span className="text-2xl font-normal text-slate-400">
                  {" "} / {TOTAL}
                </span>
              </div>

              <div className="text-sm text-slate-600">
                {Math.round((score / TOTAL) * 100)}% correct
              </div>
            </div>
          </section>

          <section className="mt-5 border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold">
              Answer review
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {[
                      "#",
                      "Question",
                      "Your answer",
                      "Correct answer",
                      "Result",
                    ].map((name) => (
                      <th
                        key={name}
                        className="border-b border-slate-300 px-3 py-3"
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {QUESTIONS.map((item) => {
                    const correct =
                      answers[item.id] === item.correct;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 align-top"
                      >
                        <td className="px-3 py-4">
                          {item.id}
                        </td>

                        <td className="px-3 py-4">
                          {item.text}
                        </td>

                        <td className="px-3 py-4">
                          {answers[item.id] === undefined
                            ? "Not answered"
                            : item.options[answers[item.id]]}
                        </td>

                        <td className="px-3 py-4">
                          {item.options[item.correct]}
                        </td>

                        <td className={`px-3 py-4 font-semibold ${
                          correct
                            ? "text-green-700"
                            : "text-red-700"
                        }`}>
                          {correct ? "Correct" : "Incorrect"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* EXPANDED QUESTION OVERVIEW MODAL */}
      {screen === "exam" && overviewOpen && (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-slate-900/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOverviewOpen(false);
            }
          }}
        >
          <section
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto border border-slate-200 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="overview-title"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="overview-title" className="text-xl font-bold">
                  Question overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {answered} / {TOTAL} answered.
                  Select any question to go to it.
                </p>
              </div>

              <button
                aria-label="Close overview"
                onClick={() => setOverviewOpen(false)}
                className="border border-slate-300 px-3 py-1"
              >
                Close
              </button>
            </div>

            <div className="grid gap-2">
              {QUESTIONS.map((item, n) => (
                <button
                  key={item.id}
                  onClick={() => openQuestion(n)}
                  className={`flex items-center gap-4 border p-4 text-left hover:border-blue-400 ${
                    n === index
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <span className="w-6 font-bold text-blue-700">
                    {n + 1}
                  </span>

                  <span className="flex-1 text-sm">
                    {item.text}
                  </span>

                  <span className={`text-xs font-semibold ${
                    answers[item.id] !== undefined
                      ? "text-green-700"
                      : "text-slate-500"
                  }`}>
                    {answers[item.id] !== undefined
                      ? "Answered"
                      : "Unanswered"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* FINAL SUBMISSION CONFIRMATION */}
      {screen === "exam" && confirmOpen && (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-slate-900/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmOpen(false);
            }
          }}
        >
          <section
            className="w-full max-w-md border border-slate-200 bg-white p-7 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <h2 id="confirm-title" className="text-xl font-bold">
              Submit exam?
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              You answered {answered} of {TOTAL} questions.
              {" "}
              {TOTAL - answered > 0
                ? `${TOTAL - answered} unanswered questions will receive zero marks.`
                : "All questions have been answered."}
            </p>

            <p className="mt-3 text-sm text-slate-600">
              This submission is final; you cannot go back or
              retake this exam.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                className={secondary}
                onClick={() => setConfirmOpen(false)}
              >
                Keep answering
              </button>

              <button className={primary} onClick={submit}>
                Submit now
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
