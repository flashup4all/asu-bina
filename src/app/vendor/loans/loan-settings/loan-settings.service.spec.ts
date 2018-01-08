import { TestBed, inject } from '@angular/core/testing';

import { LoanSettingsService } from './loan-settings.service';

describe('LoanSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanSettingsService]
    });
  });

  it('should be created', inject([LoanSettingsService], (service: LoanSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
