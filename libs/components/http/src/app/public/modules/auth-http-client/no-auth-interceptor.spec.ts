import {
  HttpHandler
} from '@angular/common/http';

import {
  SkyAppConfig,
  SkyAppRuntimeConfigParams
} from '@skyux/config';

import {
  TestBed
} from '@angular/core/testing';

import {
  SkyNoAuthInterceptor
} from './no-auth-interceptor';

import {
  createAppConfig,
  createRequest,
  Spy,
  validateRequest
} from './testing/sky-http-interceptor.test-utils';

describe('No-auth interceptor', () => {
  let mockRuntimeConfigParameters: Spy<SkyAppRuntimeConfigParams>;
  let config: SkyAppConfig;
  let next: Spy<HttpHandler>;

  beforeEach(() => {
    mockRuntimeConfigParameters = jasmine.createSpyObj(
      'RuntimeConfigParameters',
      ['get', 'getUrl']
    );

    config = {
      runtime: {
        params: mockRuntimeConfigParameters
      } as any,
      skyux: {}
    };

    next = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyAppConfig,
          useValue: config
        },
        SkyNoAuthInterceptor
      ]
    });
  });

  it('should pass through the existing request when a bb-authed request', () => {
    const interceptor: SkyNoAuthInterceptor = TestBed.get(SkyNoAuthInterceptor);
    const request = createRequest(true);

    next.handle.and.stub();

    interceptor.intercept(request, next);

    expect(next.handle).toHaveBeenCalledWith(request);
  });

  it('should preserve urls not matching the 1bb protocol', (done) => {
    const interceptor = new SkyNoAuthInterceptor(createAppConfig());

    const request = createRequest(
      false,
      'google.com'
    );

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe('google.com');
    });

    interceptor.intercept(request, next).subscribe(() => {});
  });

  it('should convert tokenized urls and honor the hard-coded zone.', (done) => {
    const interceptor = new SkyNoAuthInterceptor(createAppConfig());

    const request = createRequest(
      false,
      '1bb://eng-hub00-pusa01/version'
    );

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe('https://eng-pusa01.app.blackbaud.net/hub00/version');
    });

    interceptor.intercept(request, next).subscribe(() => {});
  });
});
