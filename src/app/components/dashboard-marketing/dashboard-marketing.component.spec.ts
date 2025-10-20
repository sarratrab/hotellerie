import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMarketingComponent } from './dashboard-marketing.component';

describe('DashboardMarketingComponent', () => {
  let component: DashboardMarketingComponent;
  let fixture: ComponentFixture<DashboardMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMarketingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
