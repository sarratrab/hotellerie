// services/response.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { baseUrl } from '../../baseURL';
import { ApiResponse } from '../models/interfaces/ApiResponse';
import { catchError  } from 'rxjs';

import { SurveyStats } from '../models/interfaces/SurveyStats';

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





export interface SurveyResponseDto {
  id: string;
  surveyId: string;
  employeeId: number;
  responseData: string; // JSON string containing the answers
  submittedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class ResponseService {
  private http = inject(HttpClient);
 private baseUrl = 'http://localhost:5096/api/SurveyResponse/'; // note trailing slash
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
      .pipe(map(r => r.data));}
 

getSurveyStats(surveyId: string): Observable<SurveyStats> {
  return this.http.get<SurveyStats>(`${this.baseUrl}${surveyId}/stats`);
}
// Add this interface for the response

// Add this method to your ResponseService class
getResponseBySurveyAndEmployee(surveyId: string, employeeId: number): Observable<SurveyResponseDto> {
    const url = `${this.baseUrl}survey/${surveyId}/employee/${employeeId}`;
    console.log(`Calling API: ${url}`);
    
    return this.http.get<{
      data: SurveyResponseDto;  // Changed to lowercase
      message: string;          // Changed to lowercase
      status: number;           // Changed to lowercase
      success: boolean;         // Changed to lowercase
    }>(url).pipe(
      map(response => {
        console.log('API Raw Response:', response);
        console.log('API Response Data:', response.data);
        return response.data;
      }),
      catchError(err => {
        console.error('API Error:', err);
        throw err;
      })
    );
  }
}
