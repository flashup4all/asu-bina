import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoanAccountOfficerComponent } from './manage-loan-account-officer.component';

describe('ManageLoanAccountOfficerComponent', () => {
  let component: ManageLoanAccountOfficerComponent;
  let fixture: ComponentFixture<ManageLoanAccountOfficerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLoanAccountOfficerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLoanAccountOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
