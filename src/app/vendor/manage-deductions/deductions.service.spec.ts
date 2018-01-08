import { TestBed, inject } from '@angular/core/testing';

import { DeductionsService } from './deductions.service';

describe('DeductionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeductionsService]
    });
  });

  it('should be created', inject([DeductionsService], (service: DeductionsService) => {
    expect(service).toBeTruthy();
  }));
});
