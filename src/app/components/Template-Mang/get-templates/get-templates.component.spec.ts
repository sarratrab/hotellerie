import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTemplatesComponent } from './get-templates.component';

describe('GetTemplatesComponent', () => {
  let component: GetTemplatesComponent;
  let fixture: ComponentFixture<GetTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
