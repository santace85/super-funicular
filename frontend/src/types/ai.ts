// ==============================
// Shared AI Response
// ==============================

export interface AiResponse {
  result: string;
}

// ==============================
// Cover Letter
// ==============================

export interface CoverLetterRequest {
  resumeSummary: string;
  jobDescription: string;
}

// ==============================
// Resume Optimization
// ==============================

export interface OptimizeResumeRequest {
  resumeText: string;
  atsOptimized: boolean;
}

export interface TailorResumeRequest {
  resumeText: string;
  jobDescription: string;
  atsOptimized: boolean;
}

// ==============================
// Interview Helper
// ==============================

export type InterviewTone =
  | "confident"
  | "technical"
  | "leadership"
  | "concise";

export type ExperienceLevel = "entry" | "mid" | "senior" | "executive";

export interface InterviewAnswerRequest {
  question: string;
  tone: string;
  experienceLevel: string;
}
