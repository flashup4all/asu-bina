import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSavingsComponent } from './target-savings.component';

describe('TargetSavingsComponent', () => {
  let component: TargetSavingsComponent;
  let fixture: ComponentFixture<TargetSavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetSavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
