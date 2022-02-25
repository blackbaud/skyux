import { SkyAppLocaleProvider } from './locale-provider';
import { take } from 'rxjs/operators';

describe('Locale provider', () => {
  it('should get locale from browser language', () => {
    const provider = new SkyAppLocaleProvider();
    provider
      .getLocaleInfo()
      .pipe(take(1))
      .subscribe((localeInfo) => {
        expect(localeInfo.locale).toEqual('en-US');
      });
  });
});
