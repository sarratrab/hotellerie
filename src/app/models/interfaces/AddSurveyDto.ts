export interface AddSurveyDto {
  name: string;
  description?: string;
  templateId: string;
  deadline: string;        // ISO string
  isAnonymous: boolean;
  surveyStatus: number;    // 0 si tu veux "Draft" ou ce que ton enum attend
  employeeIds: number[];
  allEmployees: boolean;           // Add this field
  DepartmentIds: number[];
  PositionIds: number[];
  SelectedCities: string[];
}
