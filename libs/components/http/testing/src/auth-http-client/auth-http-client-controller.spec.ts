import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SkyAppConfig } from '@skyux/config';
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

  public doSomething(): Observable<unknown> {
    return this.httpClient.get(
      'https://www.example.com/',
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
});
