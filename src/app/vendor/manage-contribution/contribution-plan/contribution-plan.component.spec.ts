import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionPlanComponent } from './contribution-plan.component';

describe('ContributionPlanComponent', () => {
  let component: ContributionPlanComponent;
  let fixture: ComponentFixture<ContributionPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributionPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
