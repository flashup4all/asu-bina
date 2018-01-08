import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSettingsComponent } from './loan-settings.component';

describe('LoanSettingsComponent', () => {
  let component: LoanSettingsComponent;
  let fixture: ComponentFixture<LoanSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
