import { TestBed, inject } from '@angular/core/testing';

import { StaffService } from './staff.service';

describe('ManageStaffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaffService]
    });
  });

  it('should be created', inject([StaffService], (service: StaffService) => {
    expect(service).toBeTruthy();
  }));
});
