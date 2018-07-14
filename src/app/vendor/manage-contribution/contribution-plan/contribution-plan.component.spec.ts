import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionTypeComponent } from './contribution-type.component';

describe('ContributionTypeComponent', () => {
  let component: ContributionTypeComponent;
  let fixture: ComponentFixture<ContributionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
