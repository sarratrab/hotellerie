import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { baseUrl } from '../../baseURL';
import { AddSurveyDto } from '../models/interfaces/AddSurveyDto';

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


@Injectable({
  providedIn: 'root'
})
export class SurveyService {
 
  private apiUrl = 'http://localhost:5096/'; // adjust port

  constructor(private http: HttpClient) {}

  addSurvey(dto: AddSurveyDto): Observable<string> {
    // le back renvoie du text/plain => responseType:'text'
    return this.http.post(`${baseUrl}api/Survey/AddSurvey`, dto, { responseType: 'text' });
  }

  getAll(): Observable<SurveyOutDto[]> {
    return this.http.get<any>(`${baseUrl}api/Survey/GetAllSurveys`)
      .pipe(map(res => res.data));
  }
  getCompleted(): Observable<SurveyOutDto[]> {
    return this.http.get<any>(`${baseUrl}api/Survey/GetCompleted`).pipe(map(res => res.data));
  }
  complete(id: string): Observable<any> {
    return this.http.post(`${baseUrl}api/Survey/Complete/${id}`, {});
  }
  // optionnel
  syncStatuses(): Observable<any> {
    return this.http.post(`${baseUrl}api/Survey/SyncStatuses`, {});
  }

   // in SurveyService
updateSurvey(surveyId: string, dto: AddSurveyDto): Observable<void> {
  // Backend expects PUT with surveyId in URL and DTO in body
  return this.http.put<void>(`${baseUrl}api/Survey/UpdateSurvey/${surveyId}`, dto);
}
// survey.service.ts
getById(surveyId: string): Observable<SurveyOutDto> {
  return this.http
    .get<{ data: SurveyOutDto }>(`${baseUrl}api/Survey/GetSurveyById/${surveyId}`)
    .pipe(map(resp => resp.data)); // unwrap 'data'
}

addSurveyAnswer(surveyId: string, employeeId: string, answers: string, isFinal: boolean) {
  return this.http.post(`${baseUrl}api/SurveyResponse/Answer`, {
    surveyId,
    employeeId,
    answers,
    isFinal
  });
}

}
