import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { baseUrl } from '../../baseURL';
import { ApiResponse } from '../models/interfaces/template-read';
import { map } from 'rxjs/operators';
import { AddTypeDto } from '../models/interfaces/AddTypeDto';
import { TypeOutDto } from '../models/interfaces/TypeOutDto';

@Injectable({
  providedIn: 'root'
})
export class TypeServiceService {
  private http = inject(HttpClient);

  create(payload: AddTypeDto) {
    return this.http
      .post<ApiResponse<TypeOutDto>>(`${baseUrl}api/TemplateType/Create`, payload)
      .pipe(map(res => res.data));
  }

  list(q?: string) {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    return this.http
      .get<ApiResponse<TypeOutDto[]>>(`${baseUrl}api/TemplateType/List`, { params })
      .pipe(map(res => res.data));
  }

  get(id: string) {
    return this.http
      .get<ApiResponse<TypeOutDto>>(`${baseUrl}api/TemplateType/Get/${id}`)
      .pipe(map(res => res.data));
  }

  delete(id: string) {
    return this.http
      .delete<ApiResponse<boolean>>(`${baseUrl}api/TemplateType/Delete/${id}`);
  }

  update(id: string, body: { name: string; color: string }) {
    return this.http
      .put<ApiResponse<TypeOutDto>>(`${baseUrl}api/TemplateType/Update/${id}`, body);
  }
}
