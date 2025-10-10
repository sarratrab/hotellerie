import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

export interface SurveyResponseItem {
  FieldId: string;
  Type: string;   // 'text' | 'radio' | 'checkbox' | 'select' | ...
  Value: any;
}

/**
 * Mock dataset keyed by surveyId.
 * Add/modify entries to test different cases.
 */
const MOCK_RESPONSES: Record<string, SurveyResponseItem[]> = {
  '11abe8ee-107d-4f05-a507-a2681e91899c': [
    {
      FieldId: 'fe066c0e-789d-4965-82f1-8e8a79d2a0f2',
      Type: 'text',
      Value: 'hllo',
    },
    {
      FieldId: '4dba9f7b-82dc-4506-8f79-8ff1876584ab',
      Type: 'radio',
      Value: 'option2',
    },
  ],
  // Add more surveyIds for testing:
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee': [
    { FieldId: 'q1', Type: 'text', Value: 'Example text' },
    { FieldId: 'q2', Type: 'checkbox', Value: ['a', 'c'] },
    { FieldId: 'q3', Type: 'select', Value: 'opt-3' },
  ],
};

@Injectable({ providedIn: 'root' })
export class MockResponseService {
  /**
   * Mimics: ResponseService.getAnswersForSurvey(surveyId: string)
   */
  getAnswersForSurvey(surveyId: string): Observable<SurveyResponseItem[]> {
    const data = MOCK_RESPONSES[surveyId] ?? [];
    // Simulate network latency
    return of(data).pipe(delay(300));
  }

  /**
   * Mimics: ResponseService.getAnswersMapForSurvey(surveyId: string)
   */
  getAnswersMapForSurvey(surveyId: string): Observable<Record<string, any>> {
    return this.getAnswersForSurvey(surveyId).pipe(
      map((arr) =>
        arr.reduce((acc, x) => {
          acc[x.FieldId] = x.Value;
          return acc;
        }, {} as Record<string, any>)
      )
    );
  }
}