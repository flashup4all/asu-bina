import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunContributionComponent } from './run-contribution.component';

describe('RunContributionComponent', () => {
  let component: RunContributionComponent;
  let fixture: ComponentFixture<RunContributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunContributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
