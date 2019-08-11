import { TestBed, inject } from '@angular/core/testing';

import { LocalService } from './local.service';

describe('LocalService', () => {
	let localservice = LocalService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalService]
    });
  });

  it('should be created', inject([LocalService], (service: LocalService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a string', (string)=>{
  	expect(this.localservice.check_for_empty_string(string)).toBe('string')
  })
});
