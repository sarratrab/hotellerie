// services/response.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../baseURL';

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

@Injectable({ providedIn: 'root' })
export class ResponseService {
  private http = inject(HttpClient);

  saveResponse(dto: SaveResponseDto): Observable<void> {
    return this.http.post<void>(
      `${baseUrl}api/surveys/${dto.surveyId}/responses/submit-by-employee`,
      dto
    );
  }
}
