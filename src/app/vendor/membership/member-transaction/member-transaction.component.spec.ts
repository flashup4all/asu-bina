import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTransactionComponent } from './member-transaction.component';

describe('MemberTransactionComponent', () => {
  let component: MemberTransactionComponent;
  let fixture: ComponentFixture<MemberTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('return the subtraction of to numbers', () => {
    // expect(component.calculate_total_balance(expect(a).toBeDefined(),b))
  })
});
