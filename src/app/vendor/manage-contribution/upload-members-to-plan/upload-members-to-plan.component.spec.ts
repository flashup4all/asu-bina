import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMembersToPlanComponent } from './upload-members-to-plan.component';

describe('UploadMembersToPlanComponent', () => {
  let component: UploadMembersToPlanComponent;
  let fixture: ComponentFixture<UploadMembersToPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadMembersToPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMembersToPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
