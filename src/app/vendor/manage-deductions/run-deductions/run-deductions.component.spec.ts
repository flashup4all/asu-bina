import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunDeductionsComponent } from './run-deductions.component';

describe('RunDeductionsComponent', () => {
  let component: RunDeductionsComponent;
  let fixture: ComponentFixture<RunDeductionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunDeductionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
