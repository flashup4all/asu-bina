import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersFormComponent } from './members-form.component';

describe('MembersFormComponent', () => {
  let component: MembersFormComponent;
  let fixture: ComponentFixture<MembersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
