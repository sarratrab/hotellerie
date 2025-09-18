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

   // in SurveyService
updateSurvey(surveyId: string, dto: AddSurveyDto): Observable<void> {
  // Backend expects PUT with surveyId in URL and DTO in body
  return this.http.put<void>(`${baseUrl}api/Survey/UpdateSurvey/${surveyId}`, dto);
}

}
