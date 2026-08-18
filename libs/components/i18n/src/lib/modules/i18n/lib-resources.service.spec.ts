// #region imports
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyLibResourcesProvider } from './lib-resources-provider';
import { SkyLibResourcesService } from './lib-resources.service';
import { SkyAppLocaleInfo } from './locale-info';
import { SkyAppLocaleProvider } from './locale-provider';

// #endregion

class MockSkyLibResourcesProvider implements SkyLibResourcesProvider {
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string,
  ): string | undefined {
    const resources: any = {
      en_US: {
        greeting: 'hello',
        greeting_alternate: 'hi',
        hi: 'hello',
        hi_alternate: 'howdy',
        template: 'format {0} me {1} {0}',
      },
      fr_CA: {
        greeting: 'bonjour',
        'hi!': 'bonjour!',
      },
      fr_FR: {
        greeting: 'hello {0} {1}',
      },
      is_empty: { greeting: '' }, // <-- support empty messages
    };

    const values = resources[localeInfo.locale];

    if (values) {
      return values[name];
    }

    return '';
  }
}

describe('Library resources service', () => {
  let service: SkyLibResourcesService;
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockProviders: SkyLibResourcesProvider[];

  beforeEach(() => {
    mockLocaleProvider = {
      defaultLocale: 'en_US',
      getLocaleInfo: () => observableOf({ locale: 'en_US' }),
    };

    mockProviders = [
      new MockSkyLibResourcesProvider(),
      new MockSkyLibResourcesProvider(),
    ];
  });

  it('should get a string for a locale', () => {
    service = new SkyLibResourcesService(
      mockLocaleProvider,
      mockProviders,
      undefined,
    );
    const value = service.getStringForLocale(
      {
        locale: 'en_US',
      },
      'greeting',
    );
    expect(value).toEqual('hello');
  });

  it('should get a string from the static resources property', () => {
    service = new SkyLibResourcesService(mockLocaleProvider);

    SkyLibResourcesService.addResources({
      'EN-US': {
        my_string: {
          message: 'Hello, world!',
        },
      },
    });

    expect(
      service.getStringForLocale({ locale: 'EN-US' }, 'my_string'),
    ).toEqual('Hello, world!');
  });

  it('should get a string for the default locale using locale provider', () => {
    service = new SkyLibResourcesService(
      mockLocaleProvider,
      mockProviders,
      undefined,
    );
    service
      .getString('greeting')
      .pipe(take(1))
      .subscribe((value: string) => {
        expect(value).toEqual('hello');
      });
  });

  it('should get a string for a locale using locale provider', () => {
    spyOn(mockLocaleProvider, 'getLocaleInfo').and.returnValue(
      observableOf({
        locale: 'fr_CA',
      }),
    );
    service = new SkyLibResourcesService(
      mockLocaleProvider,
      mockProviders,
      undefined,
    );
    service
      .getString('greeting')
      .pipe(take(1))
      .subscribe((value: string) => {
        expect(value).toEqual('bonjour');
      });
  });

  it('should return the key if no string found', () => {
    service = new SkyLibResourcesService(
      mockLocaleProvider,
      undefined,
      undefined,
    );
    service
      .getString('greeting')
      .pipe(take(1))
      .subscribe((value: string) => {
        expect(value).toEqual('greeting');
      });
  });

  it('should handle formatted strings', () => {
    spyOn(mockLocaleProvider, 'getLocaleInfo').and.returnValue(
      observableOf({
        locale: 'fr_FR',
      }),
    );
    service = new SkyLibResourcesService(
      mockLocaleProvider,
      mockProviders,
      undefined,
    );
    service
      .getString('greeting', 'foo', 'bar')
      .pipe(take(1))
      .subscribe((value: string) => {
        expect(value).toEqual('hello foo bar');
      });
  });

  it('should use the name from the name provider', () => {
    const mockResourceNameProvider: any = {
      getResourceName: (name: string) => {
        return observableOf(name + '_alternate');
      },
    };

    service = new SkyLibResourcesService(
      mockLocaleProvider,
      mockProviders,
      mockResourceNameProvider,
    );

    service
      .getString('greeting')
      .pipe(take(1))
      .subscribe((value: string) => {
        expect(value).toEqual('hi');
      });
  });

  it('should support empty library resource strings', () => {
    spyOn(mockLocaleProvider, 'getLocaleInfo').and.returnValue(
      observableOf({
        locale: 'is_empty',
      }),
    );

    service = new SkyLibResourcesService(
      mockLocaleProvider,
      mockProviders,
      undefined,
    );
    service
      .getString('greeting')
      .pipe(take(1))
      .subscribe((value: string) => {
        expect(value).toEqual('');
      });
  });

  it('should re-emit when locale changes', (done) => {
    const localeSubject = new BehaviorSubject({ locale: 'en_US' });
    const dynamicLocaleProvider: SkyAppLocaleProvider = {
      defaultLocale: 'en_US',
      getLocaleInfo: () => localeSubject.asObservable(),
    };

    service = new SkyLibResourcesService(
      dynamicLocaleProvider,
      mockProviders,
      undefined,
    );

    const emissions: string[] = [];
    service.getString('greeting').subscribe((value) => {
      emissions.push(value);

      if (emissions.length === 1) {
        expect(emissions[0]).toBe('hello');
        localeSubject.next({ locale: 'fr_CA' });
      } else if (emissions.length === 2) {
        expect(emissions[1]).toBe('bonjour');
        done();
      }
    });
  });

  describe('getStrings', () => {
    it('returns a completed observable on initial emission', () => {
      service = new SkyLibResourcesService(
        mockLocaleProvider,
        mockProviders,
        undefined,
      );
      const resources$ = service.getStrings({}).pipe(take(1));

      const complete = jasmine.createSpy('complete');
      resources$.subscribe({
        complete,
        next: () => fail(),
        error: () => fail(),
      });
      expect(complete).toHaveBeenCalled();
    });

    it('returns a dictionary of resources (1 resource)', (done) => {
      service = new SkyLibResourcesService(
        mockLocaleProvider,
        mockProviders,
        undefined,
      );
      const resources$ = service.getStrings({ hi: 'hello' }).pipe(take(1));

      resources$.subscribe((values) => {
        expect(Object.keys(values).length).toBe(1);
        expect(values.hi).toBe('hello');
        expect((values as any)['hi_alternate']).toBeUndefined();
        expect((values as any)['NOT DEFINED']).toBeUndefined();
        done();
      });
    });

    it('returns a dictionary of resources (1+ resources)', (done) => {
      service = new SkyLibResourcesService(
        mockLocaleProvider,
        mockProviders,
        undefined,
      );
      const resources$ = service
        .getStrings({
          hi: 'hello',
          hi_alternate: 'hi_alternate',
        })
        .pipe(take(1));

      resources$.subscribe((values) => {
        expect(Object.keys(values).length).toBe(2);
        expect((values as any)['NOT DEFINED']).toBeUndefined();
        expect(values.hi).toBe('hello');
        expect(values.hi_alternate).toBe('howdy');
        done();
      });
    });

    it('handles templated resources', (done) => {
      service = new SkyLibResourcesService(
        mockLocaleProvider,
        mockProviders,
        undefined,
      );
      const resources$ = service
        .getStrings({
          hi: 'hello',
          hiAlternate: 'hi_alternate',
          hiWithTemplateSyntax: ['hi'],
          template: ['template', 'a', 'b'],
          templateWithMissingTokens: ['template'],
        })
        .pipe(take(1));

      resources$.subscribe((values) => {
        expect(Object.keys(values).length).toBe(5);
        expect(values.hi).toBe('hello');
        expect(values.hiAlternate).toBe('howdy');
        expect(values.hiWithTemplateSyntax).toBe('hello');
        expect(values.template).toBe('format a me b a');
        expect(values.templateWithMissingTokens).toBe('format {0} me {1} {0}');
        done();
      });
    });

    it('handles locales', (done) => {
      spyOn(mockLocaleProvider, 'getLocaleInfo').and.returnValue(
        observableOf({ locale: 'fr_FR' }),
      );
      service = new SkyLibResourcesService(
        mockLocaleProvider,
        mockProviders,
        undefined,
      );
      const resources$ = service
        .getStrings({
          greeting: 'bonjour',
          'hi!': 'bonjour!',
        })
        .pipe(take(1));

      resources$.subscribe((values) => {
        expect(Object.keys(values).length).toBe(2);
        expect(values.greeting).toBe('bonjour');
        expect(values['hi!']).toBe('bonjour!');
        done();
      });
    });

    it('re-emits when locale changes for getString', (done) => {
      const localeSubject = new BehaviorSubject({ locale: 'en_US' });
      const dynamicLocaleProvider: SkyAppLocaleProvider = {
        defaultLocale: 'en_US',
        getLocaleInfo: () => localeSubject.asObservable(),
      };

      service = new SkyLibResourcesService(
        dynamicLocaleProvider,
        mockProviders,
        undefined,
      );

      const emissions: string[] = [];
      service.getString('greeting').subscribe((value) => {
        emissions.push(value);

        if (emissions.length === 1) {
          expect(emissions[0]).toBe('hello');
          localeSubject.next({ locale: 'fr_CA' });
        } else if (emissions.length === 2) {
          expect(emissions[1]).toBe('bonjour');
          done();
        }
      });
    });

    it('re-emits when locale changes for getStrings', (done) => {
      const localeSubject = new BehaviorSubject({ locale: 'en_US' });
      const dynamicLocaleProvider: SkyAppLocaleProvider = {
        defaultLocale: 'en_US',
        getLocaleInfo: () => localeSubject.asObservable(),
      };

      service = new SkyLibResourcesService(
        dynamicLocaleProvider,
        mockProviders,
        undefined,
      );

      const emittedDictionaries: Array<Record<string, string>> = [];
      service
        .getStrings({
          greeting: 'greeting',
        })
        .subscribe((values) => {
          emittedDictionaries.push(values);

          if (emittedDictionaries.length === 1) {
            expect(emittedDictionaries[0]['greeting']).toBe('hello');
            localeSubject.next({ locale: 'fr_CA' });
          } else if (emittedDictionaries.length === 2) {
            expect(emittedDictionaries[1]['greeting']).toBe('bonjour');
            done();
          }
        });
    });
  });
});
