import { TestBed } from '@angular/core/testing';

import { LaunchSurveyStateService } from './launch-survey-state.service';

describe('LaunchSurveyStateService', () => {
  let service: LaunchSurveyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchSurveyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
