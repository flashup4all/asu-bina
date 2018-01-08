import { TestBed, inject } from '@angular/core/testing';

import { LoanRequestService } from './loan-request.service';

describe('LoanRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanRequestService]
    });
  });

  it('should be created', inject([LoanRequestService], (service: LoanRequestService) => {
    expect(service).toBeTruthy();
  }));
});
