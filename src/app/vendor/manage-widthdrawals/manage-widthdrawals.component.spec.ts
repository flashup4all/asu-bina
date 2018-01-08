import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWidthdrawalsComponent } from './manage-widthdrawals.component';

describe('ManageWidthdrawalsComponent', () => {
  let component: ManageWidthdrawalsComponent;
  let fixture: ComponentFixture<ManageWidthdrawalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWidthdrawalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWidthdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
