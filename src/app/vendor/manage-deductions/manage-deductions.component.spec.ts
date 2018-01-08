import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeductionsComponent } from './manage-deductions.component';

describe('ManageDeductionsComponent', () => {
  let component: ManageDeductionsComponent;
  let fixture: ComponentFixture<ManageDeductionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDeductionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
