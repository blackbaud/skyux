import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import { NumericPipeFixtureComponent } from './fixtures/numeric.pipe.fixture';
import { SkyNumericModule } from './numeric.module';
import { NumericOptions, SkyNumericOptions } from './numeric.options';
import { SkyNumericPipe } from './numeric.pipe';
import { SkyNumericService } from './numeric.service';

describe('Numeric pipe', () => {
  let pipe: SkyNumericPipe;
  let changeDetector: any;
  let numericService: SkyNumericService;
  let expectedConfig: SkyNumericOptions;

  beforeEach(() => {
    changeDetector = {
      markForCheck: jasmine.createSpy('markForCheck'),
    };

    expectedConfig = new SkyNumericOptions();
    expectedConfig.digits = 1;
    expectedConfig.format = 'number';
    expectedConfig.iso = 'USD';

    TestBed.configureTestingModule({
      declarations: [NumericPipeFixtureComponent],
      imports: [SkyNumericModule],
    });

    numericService = TestBed.inject(SkyNumericService);
    pipe = new SkyNumericPipe(
      TestBed.inject(SkyAppLocaleProvider),
      numericService,
      changeDetector
    );
  });

  it('should pass default configuration to service', () => {
    const spy = spyOn(numericService, 'formatNumber').and.callThrough();
    const result = pipe.transform(2.45, {});

    expect(result).toEqual('2.5');
    expect(spy).toHaveBeenCalledWith(2.45, expectedConfig);
  });

  it('should handle undefined config', () => {
    const spy = spyOn(numericService, 'formatNumber').and.callThrough();
    const result = pipe.transform(2.45, undefined);

    expect(result).toEqual('2.5');
    expect(spy).toHaveBeenCalledWith(2.45, expectedConfig);
  });

  it('should default digits to zero if truncate set to false', () => {
    const options: SkyNumericOptions = {
      truncate: false,
    };
    expect(pipe.transform(42.87, options)).toBe('43');
  });

  it('should default digits to minDigits if minDigits is given but digits is not', () => {
    const options: SkyNumericOptions = {
      minDigits: 3,
    };
    expect(pipe.transform(42.87549, options)).toBe('42.875');
  });

  it('should throw an error is minDigits is greater than the given digits', () => {
    const options: SkyNumericOptions = {
      minDigits: 3,
      digits: 2,
    };
    expect(() => {
      pipe.transform(42.87549, options);
    }).toThrowError();
  });

  describe('locale support', () => {
    let fixture: ComponentFixture<NumericPipeFixtureComponent>;
    let component: NumericPipeFixtureComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(NumericPipeFixtureComponent);
      component = fixture.componentInstance;
    });

    it('should allow overriding SkyAppLocaleProvider', () => {
      fixture.detectChanges();

      // Get formatted date and remove unwanted special characters.
      const el = document.querySelector('p');
      const actual = el.innerHTML.trim().replace(/&nbsp;/g, ' ');

      const expected = [
        '1.234.567,89 $', // IE11 doesn't render 'US'.
        '1.234.567,89 US$',
      ];

      // Expect spanish default format of ###.###.###,## CUR[SYMBOL].
      expect(expected).toContain(actual);
    });

    it('should properly format date based on pipe locale parameter', () => {
      component.locale = 'ru';

      fixture.detectChanges();

      // Get formatted date and remove unwanted special characters.
      const el = document.querySelector('p');
      const actual = el.innerHTML.trim().replace(/&nbsp;/g, ' ');

      // Expect russian default format of ### ### ###,## [SYMBOL].
      expect(actual).toEqual('1 234 567,89 $');
    });
  });

  describe('caching', () => {
    it('should cache the result when calling `transform` twice with no value change', () => {
      const spy = spyOn(numericService, 'formatNumber').and.callThrough();
      pipe.transform(42.87549);
      expect(spy).toHaveBeenCalledTimes(1);

      pipe.transform(42.87549);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should cache the result when calling `transform` twice with no options changes', () => {
      const options: SkyNumericOptions = {
        minDigits: 3,
        locale: 'en-US',
      };
      const spy = spyOn(numericService, 'formatNumber').and.callThrough();
      expect(pipe.transform(42.87549, options)).toBe('42.875');
      expect(spy).toHaveBeenCalledTimes(1);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not cache the result when calling `transform` twice with a value change', () => {
      const spy = spyOn(numericService, 'formatNumber').and.callThrough();
      pipe.transform(42.8755);
      expect(spy).toHaveBeenCalledTimes(1);

      pipe.transform(42.87549);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should not cache the result when calling `transform` with options changes', () => {
      const options: NumericOptions = {
        digits: 4,
        format: 'number',
        currencySign: 'standard',
        iso: 'USD',
        locale: 'en-US',
        minDigits: 3,
        truncate: false,
        truncateAfter: 0,
      };
      const spy = spyOn(numericService, 'formatNumber').and.callThrough();
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(1);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(1);

      options.digits = 5;
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(2);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(2);

      options.format = 'currency';
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(3);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(3);

      options.currencySign = 'accounting';
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(4);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(4);

      options.iso = 'GBP';
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(5);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(5);

      options.locale = 'en-GB';
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(6);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(6);

      options.minDigits = 5;
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(7);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(7);

      options.truncate = true;
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(8);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(8);

      options.truncateAfter = 2;
      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(9);

      pipe.transform(42.87549, options);
      expect(spy).toHaveBeenCalledTimes(9);
    });

    it('should not cache the result when calling `transform` twice with a provided locale change', () => {
      const fixture = TestBed.createComponent(NumericPipeFixtureComponent);
      const component = fixture.componentInstance;
      const spy = spyOn(numericService, 'formatNumber').and.callThrough();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);

      component.updateLocaleProviderLocale('en-US');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
