import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateTemplateDialogComponent } from './duplicate-template-dialog.component';

describe('DuplicateTemplateDialogComponent', () => {
  let component: DuplicateTemplateDialogComponent;
  let fixture: ComponentFixture<DuplicateTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateTemplateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
