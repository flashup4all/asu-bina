import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentHistoryComponent } from './investment-history.component';

describe('InvestmentHistoryComponent', () => {
  let component: InvestmentHistoryComponent;
  let fixture: ComponentFixture<InvestmentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
