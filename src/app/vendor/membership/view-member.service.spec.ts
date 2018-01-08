import { TestBed, inject } from '@angular/core/testing';

import { ViewMemberService } from './view-member.service';

describe('ViewMemberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewMemberService]
    });
  });

  it('should be created', inject([ViewMemberService], (service: ViewMemberService) => {
    expect(service).toBeTruthy();
  }));
});
