import { TestBed, inject } from '@angular/core/testing';

import { WidthdrawalsService } from './widthdrawals.service';

describe('WidthdrawalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WidthdrawalsService]
    });
  });

  it('should be created', inject([WidthdrawalsService], (service: WidthdrawalsService) => {
    expect(service).toBeTruthy();
  }));
});
