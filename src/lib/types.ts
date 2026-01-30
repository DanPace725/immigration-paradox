export interface Question {
  text: string;
  answer: "Yes" | "No";
  feedback: string;
}

export interface Source {
  title: string;
  url: string;
  description?: string;
}

export interface Vignette {
  id: number;
  title: string;
  person: string;
  scenario: string;
  q1: Question; // Legal status question
  q2: Question; // Compliance question
  explanation: string;
  conflictType: "Consistent" | "Paradox" | "Tragedy" | "Nuanced";
  conflictText: string;
  // Statistics for scale impact
  scaleEstimate: string;
  scaleDescription: string;
  affectedPopulation: {
    low: number;
    high: number;
    unit: string; // "people", "annually", etc.
  };
  sources: Source[];
}

export interface UserAnswers {
  q1: "Yes" | "No" | null;
  q2: "Yes" | "No" | null;
  deportationOpinion: "Yes" | "No" | "Unsure" | null;
}

export interface AnswerHistoryItem extends Vignette {
  userQ1: "Yes" | "No" | null;
  userQ2: "Yes" | "No" | null;
  deportationOpinion: "Yes" | "No" | "Unsure" | null;
  points: number;
}

export interface QuizState {
  started: boolean;
  currentIndex: number;
  score: number;
  showFeedback: boolean;
  showDeportationQuestion: boolean;
  userAnswers: UserAnswers;
  quizFinished: boolean;
  answerHistory: AnswerHistoryItem[];
}
