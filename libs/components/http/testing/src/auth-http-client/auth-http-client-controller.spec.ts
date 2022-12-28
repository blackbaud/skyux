import { HttpClient, HttpEvent } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SkyAppConfig } from '@skyux/config';
import { SkyAuthTokenProvider, skyAuthHttpOptions } from '@skyux/http';

import { Observable } from 'rxjs';

import { SkyAuthHttpClientTestingModule } from './auth-http-client-testing.module';
import { SkyAuthHttpTestingController } from './auth-http-testing-controller';
import { SkyAuthTokenMockProvider } from './auth-token-mock-provider';
import { SkyMockAppConfig } from './mock-app-config';

@Injectable()
class HttpConsumingService {
  constructor(
    public skyAppConfig: SkyAppConfig,
    public skyAuthTokenProvider: SkyAuthTokenProvider,
    public httpClient: HttpClient
  ) {}

  public doSomething<T>(): Observable<HttpEvent<T>> {
    return this.httpClient.get<T>(
      'https://www.example.com',
      skyAuthHttpOptions({
        observe: 'events',
        responseType: 'json',
      })
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
      providers: [
        HttpConsumingService,
        SkyAuthHttpTestingController,
        SkyAuthTokenMockProvider,
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    skyAuthHttpTestingController = TestBed.inject(SkyAuthHttpTestingController);
    service = TestBed.inject(HttpConsumingService);
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
    const subscription = service.doSomething().subscribe();
    tick();
    const req = httpTestingController.expectOne('https://www.example.com');
    expect(req.request.headers.has('Authorization')).toBe(true);
    skyAuthHttpTestingController.expectAuth(req);
    httpTestingController.verify();
    const mockProvider = TestBed.inject(SkyAuthTokenMockProvider);
    mockProvider
      .getDecodedToken()
      .then((token) => {
        expect(token).toEqual(jasmine.any(Object));
        expect(token).toEqual(
          jasmine.objectContaining({
            iss: 'https://www.example.com/',
          })
        );
        return mockProvider.getDecodedContextToken();
      })
      .then((token) => {
        expect(token).toEqual(jasmine.any(Object));
        expect(token).toEqual(
          jasmine.objectContaining({
            iss: 'https://www.example.com/',
          })
        );
        subscription.unsubscribe();
      });
  }));

  it('should error when the request is not authenticated', fakeAsync(() => {
    const client = TestBed.inject(HttpClient);
    const req = client.get('https://www.example.com');
    tick();
    expect(() => skyAuthHttpTestingController.expectAuth(req)).toThrowError();
  }));

  it('should error when the request is invalid', fakeAsync(() => {
    const req = {} as any;
    expect(() => skyAuthHttpTestingController.expectAuth(req)).toThrowError();
  }));
});
