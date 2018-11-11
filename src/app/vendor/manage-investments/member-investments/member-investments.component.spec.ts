import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMemberInvestmentsComponent } from './member-investments.component';

describe('ManageMemberInvestmentsComponent', () => {
  let component: ManageMemberInvestmentsComponent;
  let fixture: ComponentFixture<ManageMemberInvestmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMemberInvestmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMemberInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
