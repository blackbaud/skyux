import { TestBed } from '@angular/core/testing';

import { FontLoadingTestingService } from './font-loading-testing.service';

describe('FontLoadingTestingService', () => {
  let service: FontLoadingTestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontLoadingTestingService);
  });

  it('should be ready', async () => {
    expect.assertions(2);
    expect(service).toBeTruthy();
    const subscription = service.ready().subscribe((ready) => {
      expect(ready).toBe(true);
    });
    subscription.unsubscribe();
  });
});
