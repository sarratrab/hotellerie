import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudienceSelection } from '../models/interfaces/AudienceSelection';
import { map, Observable } from 'rxjs';
import { EmployeeRow } from '../models/interfaces/EmployeeRow';
import { ApiResponse } from '../models/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {
  private baseUrl = 'http://localhost:5096/api/Employees';

  constructor(private http: HttpClient) {}

  getForSelection(filter: AudienceSelection): Observable<EmployeeRow[]> {
    return this.http.post<ApiResponse<EmployeeRow[]>>(
      `${this.baseUrl}/GetForSelection`, filter
    ).pipe(map(r => r.data));
  }

  getAll(): Observable<EmployeeRow[]> {
    return this.http.get<ApiResponse<EmployeeRow[]>>(
      `${this.baseUrl}/GetAll`
    ).pipe(map(r => r.data));
  }
}