import { TestBed } from '@angular/core/testing';

import { FinhubService } from './finhub.service';

describe('FinhubService', () => {
  let service: FinhubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinhubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
