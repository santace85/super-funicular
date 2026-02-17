import axios from "axios";
import type {
  CoverLetterRequest,
  OptimizeResumeRequest,
  TailorResumeRequest,
  InterviewAnswerRequest,
  AiResponse,
} from "../types/ai";

const api = axios.create({
  baseURL: "/api/ai",
});

export const generateCoverLetter = async (
  payload: CoverLetterRequest,
): Promise<AiResponse> => {
  const { data } = await api.post("/cover-letter", payload);
  return data;
};

export const optimizeResume = async (
  payload: OptimizeResumeRequest,
): Promise<AiResponse> => {
  const { data } = await api.post("/optimize-resume", payload);
  return data;
};

export const tailorResume = async (
  payload: TailorResumeRequest,
): Promise<AiResponse> => {
  const { data } = await api.post("/tailor-resume", payload);
  return data;
};

export const generateInterviewAnswer = async (
  payload: InterviewAnswerRequest,
): Promise<AiResponse> => {
  const { data } = await api.post("/interview-answer", payload);
  return data;
};
