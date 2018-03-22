import { TestBed, inject } from '@angular/core/testing';

import { TargetSavingsService } from './target-savings.service';

describe('TargetSavingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TargetSavingsService]
    });
  });

  it('should be created', inject([TargetSavingsService], (service: TargetSavingsService) => {
    expect(service).toBeTruthy();
  }));
});
