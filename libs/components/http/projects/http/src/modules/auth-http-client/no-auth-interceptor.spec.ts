import { HttpHandler } from '@angular/common/http';

import { SkyAppConfig, SkyAppRuntimeConfigParams } from '@skyux/config';

import { TestBed } from '@angular/core/testing';

import { SkyNoAuthInterceptor } from './no-auth-interceptor';

import {
  createAppConfig,
  createRequest,
  Spy,
  validateRequest,
} from './testing/sky-http-interceptor.test-utils';

describe('No-auth interceptor', () => {
  let mockRuntimeConfigParameters: Spy<SkyAppRuntimeConfigParams>;
  let mockConfig: SkyAppConfig;
  let next: Spy<HttpHandler>;

  function validateTokenizedUrl(
    interceptor: SkyNoAuthInterceptor,
    done: DoneFn
  ): void {
    const request = createRequest(false, '1bb://eng-hub00-pusa01/version');

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe(
        'https://eng-pusa01.app.blackbaud.net/hub00/version'
      );
    });

    interceptor.intercept(request, next).subscribe();
  }

  beforeEach(() => {
    mockRuntimeConfigParameters = jasmine.createSpyObj(
      'RuntimeConfigParameters',
      ['get', 'getUrl']
    );

    mockConfig = {
      runtime: {
        params: mockRuntimeConfigParameters,
      } as any,
      skyux: {},
    };

    next = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyAppConfig,
          useValue: mockConfig,
        },
        SkyNoAuthInterceptor,
      ],
    });
  });

  it('should pass through the existing request when a bb-authed request', () => {
    const interceptor: SkyNoAuthInterceptor =
      TestBed.inject(SkyNoAuthInterceptor);
    const request = createRequest(true);

    next.handle.and.stub();

    interceptor.intercept(request, next);

    expect(next.handle).toHaveBeenCalledWith(request);
  });

  it('should preserve urls not matching the 1bb protocol', (done) => {
    const interceptor = new SkyNoAuthInterceptor(createAppConfig());

    const request = createRequest(false, 'google.com');

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe('google.com');
    });

    interceptor.intercept(request, next).subscribe(() => {});
  });

  it('should convert tokenized urls and honor the hard-coded zone.', (done) => {
    const interceptor = new SkyNoAuthInterceptor(createAppConfig());

    validateTokenizedUrl(interceptor, done);
  });

  describe('with missing SkyAppConfig', () => {
    it('should fall back to params provider if SkyAppConfig is undefined', (done) => {
      const config = createAppConfig();

      const interceptor = new SkyNoAuthInterceptor(undefined, {
        params: config.runtime.params,
      } as any);

      validateTokenizedUrl(interceptor, done);
    });
  });
});
