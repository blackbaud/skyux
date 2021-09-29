import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  TestBed
} from '@angular/core/testing';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  of as observableOf,
  throwError as observableThrowError
} from 'rxjs';

import {
  take
} from 'rxjs/operators';

import {
  SkyAppLocaleProvider
} from './locale-provider';

import {
  SkyAppResourceNameProvider
} from './resource-name-provider';

import {
  SkyAppResourcesService
} from './resources.service';

describe('Resources service', () => {
  let resources: SkyAppResourcesService;
  let mockAssetsService: any;
  let testResources: any;
  let httpMock: HttpTestingController;
  let enUsUrl: string;
  let esUrl: string;
  let enGbUrl: string;
  let frCaUrl: string;

  function configureTestingModule(
    mockLocaleProvider?: any,
    mockResourceNameProvider?: any,
    excludeAssetsService?: boolean
  ): void {
    enUsUrl = 'https://example.com/locales/resources_en_US.json';
    enGbUrl = 'https://example.com/locales/resources_en_GB.json';
    esUrl = 'https://example.com/locales/resources_es.json';
    frCaUrl = 'https://example.com/locales/resources_fr_CA.json';

    testResources = {
      'hi': {
        'message': 'hello'
      },
      'hi_alternate': {
        'message': 'howdy'
      },
      'template': {
        'message': 'format {0} me {1} {0}'
      }
    };

    const providers: any[] = [
      SkyAppResourcesService
    ];

    if (excludeAssetsService) {
      mockAssetsService = undefined;
    } else {
      mockAssetsService = {
        getUrl: (path: string) => {
          if (
            // These represent unavailable locales.
            path.indexOf('fr.json') >= 0 ||
            path.indexOf('fr_FR.json') >= 0 ||
            path.indexOf('es_MX.json') >= 0
          ) {
            return undefined;
          }
          return 'https://example.com/' + path;
        }
      };

      providers.push({
        provide: SkyAppAssetsService,
        useFactory: () => mockAssetsService
      });
    }

    if (mockLocaleProvider) {
      providers.push({
        provide: SkyAppLocaleProvider,
        useValue: mockLocaleProvider
      });
    } else {
      providers.push({
        provide: SkyAppLocaleProvider,
        useValue: {
          defaultLocale: 'en-US',
          getLocaleInfo: () => observableOf({
            locale: 'en-US'
          })
        }
      });
    }

    if (mockResourceNameProvider) {
      providers.push({
        provide: SkyAppResourceNameProvider,
        useValue: mockResourceNameProvider
      });
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: providers
    });
  }

  function injectServices(): void {
    resources = TestBed.inject(SkyAppResourcesService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  function addTestResourceResponse(url?: string): void {
    const request = httpMock.expectOne(url || enUsUrl);

    request.flush(testResources);
  }

  describe('without an assets service', () => {
    beforeEach(() => {
      configureTestingModule(
        undefined,
        undefined,
        true
      );
      injectServices();
    });

    it('should fall back to the specified resource key', (done) => {
      resources.getString('hi').pipe(take(1)).subscribe((value) => {
        expect(value).toBe('hi');
        done();
      });
    });
  });

  describe('without a locale provider', () => {
    beforeEach(() => {
      configureTestingModule();
      injectServices();
    });

    it('should return the specified string', (done) => {
      resources.getString('hi').pipe(take(1)).subscribe((value) => {
        expect(value).toBe('hello');
        done();
      });

      addTestResourceResponse();
    });

    it('should return the specified string formatted with the specified parameters', (done) => {
      resources.getString('template', 'a', 'b').pipe(take(1)).subscribe((value) => {
        expect(value).toBe('format a me b a');
        done();
      });

      addTestResourceResponse();
    });

    it('should return the specified string for the locale provided ', (done: DoneFn) => {
      resources.getStringForLocale({ 'locale': 'es-MX' }, 'hi').pipe(take(1)).subscribe((value: string) => {
        expect(value).toBe('hello');
        done();
      });

      addTestResourceResponse(esUrl);
    });

    it('should return the specified string with the specified parameters for the locale provided ', (done: DoneFn) => {
      resources.getStringForLocale({ 'locale': 'es-MX' }, 'template', 'a', 'b').pipe(take(1)).subscribe((value: string) => {
        expect(value).toBe('format a me b a');
        done();
      });

      addTestResourceResponse(esUrl);
    });

    it('should fall back to the resource name if no resource file exists', (done) => {
      mockAssetsService.getUrl = (): any => {
        return undefined;
      };

      resources.getString('hi').pipe(take(1)).subscribe((value) => {
        expect(value).toBe('hi');
        done();
      });
    });

    it('only request the resource file once per instance', () => {
      resources.getString('hi').pipe(take(1)).subscribe(() => {});
      httpMock.expectOne(enUsUrl);

      resources.getString('hi').pipe(take(1)).subscribe(() => {});
      httpMock.expectNone(enUsUrl);

      resources.getString('hi').pipe(take(1)).subscribe(() => {});
      httpMock.expectNone(enUsUrl);
    });

  });

  describe('with a locale provider', () => {
    let mockLocaleProvider: SkyAppLocaleProvider;
    let currentLocale: any;
    let getLocaleInfo: any;

    beforeEach(() => {
      currentLocale = undefined;

      getLocaleInfo = () => observableOf({
        locale: currentLocale
      });

      mockLocaleProvider = {
        defaultLocale: 'en-US',
        getLocaleInfo: () => {
          return getLocaleInfo();
        }
      };

      configureTestingModule(mockLocaleProvider);

      injectServices();
    });

    it('should fall back to the default locale if a blank locale is specified', (done) => {
      currentLocale = '';

      resources.getString('hi').pipe(take(1)).subscribe((value) => {
        expect(value).toBe('hello');
        done();
      });

      addTestResourceResponse();
    });

    it(
      'should fall back to the non-region-specific locale if the specified locale does not have ' +
      'corresponding resource file',
      () => {
        currentLocale = 'es-MX';

        resources.getString('hi').pipe(take(1)).subscribe(() => { });

        addTestResourceResponse(esUrl);
      }
    );

    it(
      'should fall back to the default locale if the specified locale does not have a corresponding resource file',
      (done) => {
        currentLocale = 'fr-FR';

        resources.getString('hi').pipe(take(1)).subscribe((value) => {
          expect(value).toBe('hello');
          done();
        });

        addTestResourceResponse();
      }
    );

    it(
      'should fall back to the default locale if the specified locale file cannot be loaded',
      (done) => {
        currentLocale = 'en-GB';

        resources.getString('hi').pipe(take(1)).subscribe((value) => {
          expect(value).toBe('hello');
          done();
        });

        const request = httpMock.expectOne(enGbUrl);

        request.flush('', {
          status: 404,
          statusText: 'Not Found'
        });

        addTestResourceResponse();
      }
    );

    it(
      'should fall back to the resource name if the specified locale is the default locale and ' +
      'the locale resource file fails to load',
      (done) => {
        currentLocale = 'en-US';

        resources.getString('hi').pipe(take(1)).subscribe((value) => {
          expect(value).toBe('hi');
          done();
        });

        const request = httpMock.expectOne(enUsUrl);

        request.flush('', {
          status: 404,
          statusText: 'Not Found'
        });
      }
    );

    it(
      'should fall back to the resource name if the locale provider throws an error',
      (done) => {
        getLocaleInfo = () => observableThrowError(new Error());

        resources.getString('hi').pipe(take(1)).subscribe((value) => {
          expect(value).toBe('hi');
          done();
        });
      }
    );

    it('should use the per-locale cache for subsequent requests in the same locale', () => {
      currentLocale = 'en-US';

      resources.getString('hi').pipe(take(1)).subscribe(() => {});
      httpMock.expectOne(enUsUrl);

      resources.getString('hi').pipe(take(1)).subscribe(() => {});
      httpMock.expectNone(enUsUrl);

      resources.getString('hi').pipe(take(1)).subscribe(() => {});
      httpMock.expectNone(enUsUrl);

      currentLocale = 'fr-CA';

      resources.getString('hi').pipe(take(1)).subscribe(() => {});
      httpMock.expectOne(frCaUrl);
    });
  });

  describe('with a resource name provider', () => {
    let mockResourceNameProvider: SkyAppResourceNameProvider;
    let getResourceName: any;

    beforeEach(() => {
      mockResourceNameProvider = {
        getResourceName: (name) => {
          return getResourceName(name);
        }
      };

      configureTestingModule(undefined, mockResourceNameProvider);

      injectServices();
    });

    it('should use the name from the provider if a recognized name is returned', (done) => {
      getResourceName = (name: string) => observableOf(name + '_alternate');

      resources.getString('hi').pipe(take(1)).subscribe((value) => {
        expect(value).toBe('howdy');
        done();
      });

      addTestResourceResponse();
    });

    it(
      'should fall back to the original name if the name from the provider is unrecognized', (done) => {
      getResourceName = (name: string) => observableOf(name + '_unrecognized');

      resources.getString('hi').pipe(take(1)).subscribe((value) => {
        expect(value).toBe('hello');
        done();
      });

      addTestResourceResponse();
    });
  });

  describe('getStrings', () => {
    beforeEach(() => {
      configureTestingModule({
        defaultLocale: 'en-US',
        getLocaleInfo: () => observableOf({ locale: 'en-US' })
      });
      injectServices();
    });

    it('returns a completed observable (this is default forkJoin behavior)', (done) => {
      const resources$ = resources.getStrings({}).pipe(take(1));

      resources$.subscribe({
        next: () => fail(),
        complete: () => {
          httpMock.expectNone(enUsUrl);
          done();
        },
        error: () => fail()
      });
    });
    it('returns a dictionary of resources (1 resource)', (done) => {
      const resources$ = resources.getStrings({ hi: 'hello' }).pipe(take(1));

      resources$.subscribe(values => {
        expect(Object.keys(values).length).toBe(1);
        expect(values.hi).toBe('hello');
        expect((values as any)['hi_alternate']).toBeUndefined();
        expect((values as any)['NOT DEFINED']).toBeUndefined();
        done();
      });

      addTestResourceResponse();
    });
    it('returns a dictionary of resources (1+ resources)', (done) => {
      const resources$ = resources.getStrings({
        hi: 'hello',
        hi_alternate: 'hi_alternate'
      }).pipe(take(1));

      resources$.subscribe(values => {
        expect(Object.keys(values).length).toBe(2);
        expect((values as any)['NOT DEFINED']).toBeUndefined();
        expect(values.hi).toBe('hello');
        expect(values.hi_alternate).toBe('howdy');
        done();
      });

      addTestResourceResponse();
    });
    it('handles templated resources', (done) => {
      const resources$ = resources.getStrings({
        hi: 'hello',
        hiAlternate: 'hi_alternate',
        hiWithTemplateSyntax: ['hi'],
        template: ['template', 'a', 'b'],
        templateWithMissingTokens: ['template']
      }).pipe(take(1));

      resources$.subscribe(values => {
        expect(Object.keys(values).length).toBe(5);
        expect(values.hi).toBe('hello');
        expect(values.hiAlternate).toBe('howdy');
        expect(values.hiWithTemplateSyntax).toBe('hello');
        expect(values.template).toBe('format a me b a');
        expect(values.templateWithMissingTokens).toBe('format {0} me {1} {0}');
        done();
      });

      addTestResourceResponse();
    });
  });

});
