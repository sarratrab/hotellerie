import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTypesComponent } from './field-types.component';

describe('FieldTypesComponent', () => {
  let component: FieldTypesComponent;
  let fixture: ComponentFixture<FieldTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
