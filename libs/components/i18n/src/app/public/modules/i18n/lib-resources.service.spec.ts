// #region imports
import {
  TestBed
} from '@angular/core/testing';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyAppLocaleInfo
} from './locale-info';

import {
  SkyAppLocaleProvider
} from './locale-provider';

import {
  SkyLibResourcesProvider
} from './lib-resources-provider';

import {
  SkyLibResourcesService
} from './lib-resources.service';
// #endregion

class MockSkyLibResourcesProvider implements SkyLibResourcesProvider {
  constructor(
    private key: string
  ) { }

  public getString(localeInfo: SkyAppLocaleInfo, name: string): string {
    const resources: any = {
      'en_US': { [this.key]: 'hello' },
      'fr_CA': { [this.key]: 'bonjour' },
      'fr_FR': { [this.key]: 'hello {0} {1}' }
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
    TestBed.configureTestingModule({
      imports: [],
      providers: []
    });

    mockLocaleProvider = {
      defaultLocale: 'en_US',
      getLocaleInfo: () => {
        return Observable.of({
          locale: 'en_US'
        });
      }
    };

    mockProviders = [
      new MockSkyLibResourcesProvider('noop'),
      new MockSkyLibResourcesProvider('greeting')
    ];
  });

  it('should get a string for a locale', () => {
    service = new SkyLibResourcesService(mockLocaleProvider, mockProviders);
    const value = service.getStringForLocale({
      locale: 'en_US'
    }, 'greeting');
    expect(value).toEqual('hello');
  });

  it('should get a string for the default locale using locale provider', () => {
    service = new SkyLibResourcesService(mockLocaleProvider, mockProviders);
    service.getString('greeting').subscribe((value: string) => {
      expect(value).toEqual('hello');
    });
  });

  it('should get a string for a locale using locale provider', () => {
    spyOn(mockLocaleProvider, 'getLocaleInfo').and.returnValue(Observable.of({
      locale: 'fr_CA'
    }));
    service = new SkyLibResourcesService(mockLocaleProvider, mockProviders);
    service.getString('greeting').subscribe((value: string) => {
      expect(value).toEqual('bonjour');
    });
  });

  it('should return the key if no string found', () => {
    spyOn(mockLocaleProvider, 'getLocaleInfo').and.returnValue(Observable.of({
      locale: 'foo_BAR'
    }));
    service = new SkyLibResourcesService(mockLocaleProvider, mockProviders);
    service.getString('greeting').subscribe((value: string) => {
      expect(value).toEqual('greeting');
    });
  });

  it('should handle formatted strings', () => {
    spyOn(mockLocaleProvider, 'getLocaleInfo').and.returnValue(Observable.of({
      locale: 'fr_FR'
    }));
    service = new SkyLibResourcesService(mockLocaleProvider, mockProviders);
    service.getString('greeting', 'foo', 'bar').subscribe((value: string) => {
      expect(value).toEqual('hello foo bar');
    });
  });
});
