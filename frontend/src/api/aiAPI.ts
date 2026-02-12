import api from "./client";

export interface CoverLetterRequest {
  resumeSummary: string;
  jobDescription: string;
  isDemo: boolean;
}

export interface AiResponse {
  result: string;
}

export const generateCoverLetter = async (
  data: CoverLetterRequest,
): Promise<AiResponse> => {
  const response = await api.post<AiResponse>("/api/Ai/cover-letter", data);

  return response.data;
};
