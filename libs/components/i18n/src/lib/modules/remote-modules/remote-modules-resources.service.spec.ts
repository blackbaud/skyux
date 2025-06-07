import { TestBed } from '@angular/core/testing';

import { Observable, lastValueFrom, of } from 'rxjs';

import { SkyAppLocaleInfo } from '../i18n/locale-info';
import { SkyAppLocaleProvider } from '../i18n/locale-provider';

import { SkyRemoteModulesResourcesService } from './remote-modules-resources.service';

describe('remote-modules-resources.service', () => {
  function setupTest(options: { localeInfo: SkyAppLocaleInfo }): {
    svc: SkyRemoteModulesResourcesService;
  } {
    const { localeInfo } = options;

    TestBed.configureTestingModule({
      providers: [
        SkyRemoteModulesResourcesService,
        {
          provide: SkyAppLocaleProvider,
          useValue: {
            getLocaleInfo(): Observable<SkyAppLocaleInfo> {
              return of(localeInfo);
            },
          },
        },
      ],
    });

    SkyRemoteModulesResourcesService.addResources({
      'EN-US': {
        home_page_greeting: {
          message: 'hello',
        },
        only_en_us: {
          message: 'This is only specified for English, USA.',
        },
      },
      'FR-CA': {
        home_page_greeting: {
          message: 'bonjour',
        },
      },
    });

    const svc = TestBed.inject(SkyRemoteModulesResourcesService);

    return { svc };
  }

  afterEach(() => {
    SkyRemoteModulesResourcesService.clearResources();
  });

  it('should get a string for the default locale', async () => {
    const { svc } = setupTest({ localeInfo: { locale: 'en_US' } });

    await expectAsync(
      lastValueFrom(svc.getString('home_page_greeting')),
    ).toBeResolvedTo('hello');
  });

  it('should get a string for a non-default locale', async () => {
    const { svc } = setupTest({ localeInfo: { locale: 'fr_CA' } });

    await expectAsync(
      lastValueFrom(svc.getString('home_page_greeting')),
    ).toBeResolvedTo('bonjour');
  });

  it('should return the key if no string found', async () => {
    const { svc } = setupTest({ localeInfo: { locale: 'fr_CA' } });

    await expectAsync(lastValueFrom(svc.getString('not_found'))).toBeResolvedTo(
      'not_found',
    );
  });

  it('should return the default locale string if string for preferred locale undefined', async () => {
    const { svc } = setupTest({ localeInfo: { locale: 'fr_CA' } });

    await expectAsync(
      lastValueFrom(svc.getString('only_en_us')),
    ).toBeResolvedTo('This is only specified for English, USA.');
  });
});
