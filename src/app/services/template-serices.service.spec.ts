import { TestBed } from '@angular/core/testing';

import { TemplateService } from './template-services.service';

describe('TemplateSericesService', () => {
  let service: TemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
