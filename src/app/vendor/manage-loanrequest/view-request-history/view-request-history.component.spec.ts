import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestHistoryComponent } from './view-request-history.component';

describe('ViewRequestHistoryComponent', () => {
  let component: ViewRequestHistoryComponent;
  let fixture: ComponentFixture<ViewRequestHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
