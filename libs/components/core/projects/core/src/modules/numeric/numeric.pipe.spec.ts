import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';

import {
  NumericPipeFixtureComponent
} from './fixtures/numeric.pipe.fixture';

import {
  SkyNumericModule
} from './numeric.module';

import {
  NumericOptions
} from './numeric.options';

import {
  SkyNumericPipe
} from './numeric.pipe';

import {
  SkyNumericService
} from './numeric.service';

describe('Numeric pipe', () => {
  let pipe: any;
  let numericService: any;
  let expectedConfig: NumericOptions;

  beforeEach(() => {
    expectedConfig = new NumericOptions();
    expectedConfig.digits = 1;
    expectedConfig.format = 'number';
    expectedConfig.iso = 'USD';

    TestBed.configureTestingModule({
      declarations: [
        NumericPipeFixtureComponent
      ],
      imports: [
        SkyNumericModule
      ]
    });

    numericService = TestBed.get(SkyNumericService);
    pipe = TestBed.get(SkyNumericPipe);
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
    const options: any = {
      truncate: false
    };
    expect(pipe.transform(42.87, options)).toBe('43');
  });

  it('should default digits to minDigits if minDigits is given but digits is not', () => {
    const options: any = {
      minDigits: 3
    };
    expect(pipe.transform(42.87549, options)).toBe('42.875');
  });

  it('should throw an error is minDigits is greater than the given digits', () => {
    const options: any = {
      minDigits: 3,
      digits: 2
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
        '1.234.567,89 US$'
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
});
