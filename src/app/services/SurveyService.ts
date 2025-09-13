import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  getAll(): Observable<SurveyOutDto[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllSurveys`)
      .pipe(map(res => res.data));
  }
}
