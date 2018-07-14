import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentPlanComponent } from './investment-plan.component';

describe('InvestmentPlanComponent', () => {
  let component: InvestmentPlanComponent;
  let fixture: ComponentFixture<InvestmentPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
