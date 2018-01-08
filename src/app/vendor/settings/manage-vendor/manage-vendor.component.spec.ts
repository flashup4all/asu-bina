import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVendorComponent } from './manage-vendor.component';

describe('ManageVendorComponent', () => {
  let component: ManageVendorComponent;
  let fixture: ComponentFixture<ManageVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
