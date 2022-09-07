import { TestBed } from '@angular/core/testing';

import { SkyAuthHttpClientTestingModule } from './auth-http-client-testing.module';

describe('Auth HTTP client controller', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAuthHttpClientTestingModule],
    });
  });

  // TODO: This spec was added so that the test suite wouldn't fail.
  // We'll need to add tests to the 'http-testing' project in the future,
  // or decide if 'http-testing' can be excluded from the coverage reports altogether.
  it('should have tests', () => {
    expect(true).toBeTrue();
  });
});
