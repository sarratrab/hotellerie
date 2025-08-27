import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { baseUrl } from '../../baseURL';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddTemplateDto } from '../models/interfaces/AddTemplateDto';
import { Template } from '../models/interfaces/Template';
import { EditTemplateDto } from '../models/interfaces/EditTemplateDto';
import { TemplateOutDto } from '../models/interfaces/TemplateOutDto';
import { ApiResponse, TemplateCard, TemplateDetail } from '../models/interfaces/template-read';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private http = inject(HttpClient);

  add(template: AddTemplateDto): Observable<Template> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Template>(`${baseUrl}api/Template/CreateTemplate`, template, httpOptions);
  }

  getAll(opts?: { status?: number }): Observable<TemplateCard[]> {
    let params = new HttpParams();
    if (opts?.status !== undefined) params = params.set('status', String(opts.status));
    return this.http
      .get<ApiResponse<TemplateCard[]>>(`${baseUrl}api/Template/GetAll`, { params })
      .pipe(map(res => res.data ?? []));
  }

  getById(id: string) {
    return this.http
      .get<ApiResponse<TemplateDetail>>(`${baseUrl}api/Template/GetById/${id}`)
      .pipe(map(res => res.data));
  }

  editTemplate(dto: EditTemplateDto): Observable<ApiResponse<TemplateOutDto>> {
    return this.http.put<ApiResponse<TemplateOutDto>>(`${baseUrl}api/Template/EditTemplate`, dto);
  }

  deleteTemplate(templateId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${baseUrl}api/Template/DeleteTemplate/${templateId}`);
  }
}
