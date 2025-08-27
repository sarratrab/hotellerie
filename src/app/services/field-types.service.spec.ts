import { TestBed } from '@angular/core/testing';

import { FieldTypesService } from './field-types.service';

describe('FieldTypesService', () => {
  let service: FieldTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
