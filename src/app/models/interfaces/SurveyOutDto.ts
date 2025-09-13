export interface SurveyOutDto {
  surveyId: string;
  name: string;
  description?: string;
  templateId: string;
  createdOn: string;
  deadline: string;
  isAnonymous: boolean;
  surveyStatus: number;
  employeeIds: number[];
}