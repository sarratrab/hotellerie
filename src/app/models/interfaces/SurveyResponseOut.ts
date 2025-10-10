export interface SurveyResponseOut {
  SurveyResponseId: number;
  EmployeeId: number;
  SurveyId: number;
  SurveyResponseStatus: string;
  SubmittedOn: string; // ISO date string, e.g. "2025-10-09T13:05:14Z"
  ResponseData: string; // JSON string containing the actual answers
}