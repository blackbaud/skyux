import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

import { SkyLibResourcesLegacyService } from './lib-resources-legacy.service';
import { SkyLibResourcesProvider } from './lib-resources-provider';
import { SkyLibResourcesService } from './lib-resources.service';
import { SkyAppLocaleInfo } from './locale-info';
import { SkyAppLocaleProvider } from './locale-provider';

class MockSkyLibResourcesProvider implements SkyLibResourcesProvider {
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string,
  ): string | undefined {
    const resources: Record<string, Record<string, string>> = {
      en_US: {
        greeting: 'hello',
        template: 'format {0} me {1} {0}',
      },
      fr_CA: {
        greeting: 'bonjour',
      },
    };

    return resources[localeInfo.locale]?.[name];
  }
}

describe('Library resources legacy service', () => {
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockProviders: SkyLibResourcesProvider[];

  function createService(
    localeProvider = mockLocaleProvider,
  ): SkyLibResourcesLegacyService {
    return new SkyLibResourcesLegacyService(
      localeProvider,
      mockProviders,
      undefined,
    );
  }

  beforeEach(() => {
    mockLocaleProvider = {
      defaultLocale: 'en_US',
      getLocaleInfo: (): Observable<SkyAppLocaleInfo> =>
        observableOf({ locale: 'en_US' }),
    };

    mockProviders = [new MockSkyLibResourcesProvider()];
  });

  it('should get a string and complete', (done) => {
    const values: string[] = [];

    createService()
      .getString('greeting')
      .subscribe({
        next: (value) => values.push(value),
        complete: () => {
          expect(values).toEqual(['hello']);
          done();
        },
      });
  });

  it('should get a string with template args', (done) => {
    createService()
      .getString('template', 'a', 'b')
      .subscribe((value) => {
        expect(value).toBe('format a me b a');
        done();
      });
  });

  it('should get strings and complete', (done) => {
    const values: Record<string, string>[] = [];

    createService()
      .getStrings({
        greeting: 'greeting',
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
  });

  it('should get a string for a locale', () => {
    expect(
      createService().getStringForLocale({ locale: 'fr_CA' }, 'greeting'),
    ).toBe('bonjour');
  });

  it('should get a string for a locale with template args', () => {
    expect(
      createService().getStringForLocale(
        { locale: 'en_US' },
        'template',
        'a',
        'b',
      ),
    ).toBe('format a me b a');
  });

  it('should add resources to the resources service', () => {
    SkyLibResourcesLegacyService.addResources({
      'EN-US': {
        my_legacy_lib_string: {
          message: 'Hello, world!',
        },
      },
    });

    expect(
      new SkyLibResourcesService(mockLocaleProvider).getStringForLocale(
        { locale: 'EN-US' },
        'my_legacy_lib_string',
      ),
    ).toBe('Hello, world!');
  });

  it('should not emit again when the locale changes', () => {
    const localeSubject = new BehaviorSubject<SkyAppLocaleInfo>({
      locale: 'en_US',
    });

    const service = createService({
      defaultLocale: 'en_US',
      getLocaleInfo: (): Observable<SkyAppLocaleInfo> =>
        localeSubject.asObservable(),
    });

    const stringValues: string[] = [];
    const dictionaryValues: Record<string, string>[] = [];

    service.getString('greeting').subscribe((value) => {
      stringValues.push(value);
    });

    service.getStrings({ greeting: 'greeting' }).subscribe((value) => {
      dictionaryValues.push(value);
    });

    localeSubject.next({ locale: 'fr_CA' });

    expect(stringValues).toEqual(['hello']);
    expect(dictionaryValues).toEqual([{ greeting: 'hello' }]);
  });
});
