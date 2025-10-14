// services/response.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { baseUrl } from '../../baseURL';
import { ApiResponse } from '../models/interfaces/ApiResponse';

// app/models/interfaces/save-response.dto.ts
export interface AnswerItem {
  fieldId: string;
  type: string;
  value: string;   // pour checkbox -> JSON stringifié "[]"
}

export interface SaveResponseDto {
  templateId?: string;
  surveyId: string;      // chez toi c’est une string
  employeeId: number;    // id choisi à la main
  answers: AnswerItem[];
  finalize: boolean;
}
export interface EmployeeSurveyItemDto {
  surveyId: string;
  surveyResponseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  uiStatus: number; 
  totalFields?: number;  
  progressPercent: number;
  submittedOn?: string;
  isAnonymous: boolean;
  templateId?: string;
  typeLabel?: string;
  typeColor?: string;
  estimatedMinutes: number;  
}

export interface EmployeeSurveyListDto {
  active: EmployeeSurveyItemDto[];
  completed: EmployeeSurveyItemDto[];
}





@Injectable({ providedIn: 'root' })
export class ResponseService {
  private http = inject(HttpClient);

  saveResponse(dto: SaveResponseDto): Observable<void> {
    return this.http.post<void>(
      `${baseUrl}api/surveys/${dto.surveyId}/responses/submit-by-employee`,
      dto
    );
  }
    getForEmployee(employeeId: number): Observable<EmployeeSurveyListDto> {
    return this.http
      .get<ApiResponse<EmployeeSurveyListDto>>(
        `${baseUrl}api/Response/GetForEmployee/${employeeId}`
      )
      .pipe(map(r => r.data));
  }
}
