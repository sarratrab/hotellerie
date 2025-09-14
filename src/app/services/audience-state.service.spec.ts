import { TestBed } from '@angular/core/testing';

import { AudienceStateService } from './audience-state.service';

describe('AudienceStateService', () => {
  let service: AudienceStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudienceStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
