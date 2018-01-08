import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContributionComponent } from './manage-contribution.component';

describe('ManageContributionComponent', () => {
  let component: ManageContributionComponent;
  let fixture: ComponentFixture<ManageContributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageContributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
