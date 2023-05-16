import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';
import { SkyAuthTokenProvider, skyAuthHttpJsonOptions } from '@skyux/http';

import { Observable } from 'rxjs';

import { SkyAuthHttpClientTestingModule } from './auth-http-client-testing.module';
import { SkyAuthHttpTestingController } from './auth-http-testing-controller';
import { SkyAuthTokenMockProvider } from './auth-token-mock-provider';
import { SkyMockAppConfig } from './mock-app-config';

@Injectable({
  providedIn: 'root',
})
class HttpConsumingService {
  constructor(
    public skyAppConfig: SkyAppConfig,
    public skyAuthTokenProvider: SkyAuthTokenProvider,
    public httpClient: HttpClient
  ) {}

  public doSomething(url?: string): Observable<unknown> {
    return this.httpClient.get(
      url ?? 'https://www.example.com/',
      skyAuthHttpJsonOptions()
    );
  }
}

describe('Auth HTTP client controller', () => {
  let httpTestingController: HttpTestingController;
  let skyAuthHttpTestingController: SkyAuthHttpTestingController;
  let service: HttpConsumingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SkyAuthHttpClientTestingModule],
      providers: [SkyAuthHttpTestingController, SkyAuthTokenMockProvider],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    skyAuthHttpTestingController = TestBed.inject(SkyAuthHttpTestingController);
    service = TestBed.inject(HttpConsumingService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should provide a mock token provider', () => {
    expect(TestBed.inject(SkyAuthTokenProvider)).toEqual(
      jasmine.any(SkyAuthTokenMockProvider)
    );
  });

  it('should provide a mock app config', () => {
    expect(TestBed.inject(SkyAppConfig)).toEqual(jasmine.any(SkyMockAppConfig));
  });

  it('should assert that the request was authenticated', fakeAsync(() => {
    service.doSomething().subscribe();
    tick();
    const req = httpTestingController.expectOne('https://www.example.com/?callerid=test-svcid,spa-test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    skyAuthHttpTestingController.expectAuth(req);
    const mockProvider = TestBed.inject(SkyAuthTokenMockProvider);
    mockProvider.getDecodedToken().then((token) => {
      expect(token.iss).toEqual('https://www.example.com/');
    });
    mockProvider.getDecodedContextToken().then((contextToken) => {
      expect(contextToken.iss).toEqual('https://www.example.com/');
    });
  }));

  it('should error when the request is not authenticated', fakeAsync(() => {
    const client = TestBed.inject(HttpClient);
    client.get('https://www.example.com/').subscribe();
    tick();
    const req = httpTestingController.expectOne('https://www.example.com/');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(() => skyAuthHttpTestingController.expectAuth(req)).toThrowError(
      'The specified request does not contain the expected BBID Authorization header.'
    );
  }));

  it('should error when the request is invalid', () => {
    const req = {} as TestRequest;
    expect(() => skyAuthHttpTestingController.expectAuth(req)).toThrowError(
      'The specified request does not contain the expected BBID Authorization header.'
    );
  });

  it('should not have callerid when there is no spa name', fakeAsync(() => {
    const config = TestBed.inject(SkyAppConfig);
    config.runtime.app.name = undefined;

    service.doSomething().subscribe();
    tick();
    httpTestingController.expectOne('https://www.example.com/');
  }));

  it('should have spa name in callerid if there is no svcid', fakeAsync(() => {
    const config = TestBed.inject(SkyAppConfig);
    config.runtime.params.get = (_: string) => undefined;

    service.doSomething().subscribe();
    tick();
    httpTestingController.expectOne('https://www.example.com/?callerid=spa-test');
  }));

  it('should add the callerid to the existing query string', fakeAsync(() => {
    service.doSomething('https://www.example.com/?query=fake').subscribe();
    tick();
    httpTestingController.expectOne('https://www.example.com/?query=fake&callerid=test-svcid,spa-test');}));
});

describe('Auth HTTP client controller without config provider', () => {
  let httpTestingController: HttpTestingController;
  let service: HttpConsumingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SkyAuthHttpClientTestingModule],
      providers: [
        SkyAuthHttpTestingController,
        SkyAuthTokenMockProvider,
        {
          provide: SkyAppRuntimeConfigParamsProvider,
          useValue: undefined
        }
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HttpConsumingService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should not set callerid if there is no runtime params', fakeAsync(() => {
    const config = TestBed.inject(SkyAppConfig);
    config.runtime.params = undefined!;

    service.doSomething().subscribe();
    tick();
    httpTestingController.expectOne('https://www.example.com/');
  }));
});
