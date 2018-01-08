import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoanrequestComponent } from './manage-loanrequest.component';

describe('ManageLoanrequestComponent', () => {
  let component: ManageLoanrequestComponent;
  let fixture: ComponentFixture<ManageLoanrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLoanrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLoanrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
