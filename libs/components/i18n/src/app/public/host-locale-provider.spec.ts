import { Observable } from 'rxjs/Observable';

import {
  SkyAppHostLocaleProvider
} from '@blackbaud/skyux-builder/runtime/i18n/host-locale-provider';

describe('Host locale provider', () => {

  const mockWindowRef: any = {
    nativeWindow: {
      SKYUX_HOST: {
        acceptLanguage: 'en-GB'
      }
    }
  };

  it('should get locale info from the global SKYUX_HOST variable', (done) => {
    const localeProvider = new SkyAppHostLocaleProvider(mockWindowRef);

    localeProvider.getLocaleInfo().subscribe((info) => {
      expect(info.locale).toBe('en-GB');
      done();
    });
  });

  it(
    'should fall back to default local if the global SKYUX_HOST variable does not ' +
    'specify a language',
    (done) => {
      mockWindowRef.nativeWindow.SKYUX_HOST.acceptLanguage = undefined;

      const localeProvider = new SkyAppHostLocaleProvider(mockWindowRef);

      localeProvider.getLocaleInfo().subscribe((info) => {
        expect(info.locale).toBe('en-US');
        done();
      });
    }
  );

  it('should get locale info from the provided locale provider', (done) => {
    const localeProvider = new SkyAppHostLocaleProvider(
      mockWindowRef,
      {
        getLocaleInfo: () => {
          return Observable.of({
            locale: 'es-MX'
          });
        }
      }
    );

    localeProvider.getLocaleInfo().subscribe((info) => {
      expect(info.locale).toBe('es-MX');
      done();
    });
  });

});
