import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionRepaymentTypesComponent } from './deduction-repayment-types.component';

describe('DeductionRepaymentTypesComponent', () => {
  let component: DeductionRepaymentTypesComponent;
  let fixture: ComponentFixture<DeductionRepaymentTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeductionRepaymentTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductionRepaymentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
