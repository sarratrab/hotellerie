import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormElementsMenuComponent } from './form-elements-menu.component';

describe('FormElementsMenuComponent', () => {
  let component: FormElementsMenuComponent;
  let fixture: ComponentFixture<FormElementsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormElementsMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormElementsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
