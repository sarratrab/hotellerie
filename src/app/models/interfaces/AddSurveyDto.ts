export interface AddSurveyDto {
  name: string;
  description?: string;
  templateId: string;
  deadline: string;        
  isAnonymous: boolean;
  surveyStatus: number;   
  employeeIds: number[];
  DepartmentIds : number[];
  PositionIds : number[];
  SelectedCities : string[]; 
}
