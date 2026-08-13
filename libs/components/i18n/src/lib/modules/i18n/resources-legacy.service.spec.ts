import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SkyAppAssetsService } from '@skyux/assets';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyAppLocaleInfo } from './locale-info';
import { SkyAppLocaleProvider } from './locale-provider';
import { SkyAppResourcesLegacyService } from './resources-legacy.service';

describe('Resources legacy service', () => {
  const enUsUrl = 'https://example.com/locales/resources_en_US.json';
  const frCaUrl = 'https://example.com/locales/resources_fr_CA.json';

  const testResources = {
    hi: {
      message: 'hello',
    },
    template: {
      message: 'format {0} me {1} {0}',
    },
  };

  let httpMock: HttpTestingController;
  let localeSubject: BehaviorSubject<SkyAppLocaleInfo>;
  let resources: SkyAppResourcesLegacyService;

  function flushResources(url = enUsUrl): void {
    httpMock.expectOne(url).flush(testResources);
  }

  beforeEach(() => {
    localeSubject = new BehaviorSubject<SkyAppLocaleInfo>({ locale: 'en-US' });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyAppAssetsService,
          useValue: {
            getUrl: (path: string): string => `https://example.com/${path}`,
          },
        },
        {
          provide: SkyAppLocaleProvider,
          useValue: {
            defaultLocale: 'en-US',
            getLocaleInfo: (): Observable<SkyAppLocaleInfo> =>
              localeSubject.asObservable(),
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    resources = TestBed.inject(SkyAppResourcesLegacyService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get a string and complete', (done) => {
    const values: string[] = [];

    resources.getString('hi').subscribe({
      next: (value) => values.push(value),
      complete: () => {
        expect(values).toEqual(['hello']);
        done();
      },
    });

    flushResources();
  });

  it('should get a string with template args', (done) => {
    resources.getString('template', 'a', 'b').subscribe((value) => {
      expect(value).toBe('format a me b a');
      done();
    });

    flushResources();
  });

  it('should get strings and complete', (done) => {
    const values: Record<string, string>[] = [];

    resources
      .getStrings({
        greeting: 'hi',
        formatted: ['template', 'a', 'b'],
      })
      .subscribe({
        next: (value) => values.push(value),
        complete: () => {
          expect(values).toEqual([
            { greeting: 'hello', formatted: 'format a me b a' },
          ]);
          done();
        },
      });

    flushResources();
  });

  it('should get a string for a locale and complete', (done) => {
    const values: string[] = [];

    resources.getStringForLocale({ locale: 'fr-CA' }, 'hi').subscribe({
      next: (value) => values.push(value),
      complete: () => {
        expect(values).toEqual(['hello']);
        done();
      },
    });

    flushResources(frCaUrl);
  });

  it('should not emit again when the locale changes', () => {
    const values: string[] = [];

    resources.getString('hi').subscribe((value) => {
      values.push(value);
    });

    flushResources();

    localeSubject.next({ locale: 'fr-CA' });

    expect(values).toEqual(['hello']);
  });
});
