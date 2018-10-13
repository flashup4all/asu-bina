import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInvestmentsComponent } from './member-investments.component';

describe('MemberInvestmentsComponent', () => {
  let component: MemberInvestmentsComponent;
  let fixture: ComponentFixture<MemberInvestmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberInvestmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
