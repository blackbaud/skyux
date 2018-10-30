import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

import {
  TestBed
} from '@angular/core/testing';

import {
  SkyLibResourcesService
} from '@skyux/i18n/modules/i18n/lib-resources.service';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing/lib-resources-test.service';

import {
  SkyNumericPipe
} from './numeric.pipe';

import {
  SkyNumericService
} from './numeric.service';

import {
  NumericOptions
} from './numeric.options';

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
        SkyNumericPipe
      ],
      providers: [
        CurrencyPipe,
        DecimalPipe,
        SkyNumericPipe,
        SkyNumericService,
        {
          provide: SkyLibResourcesService,
          useClass: SkyLibResourcesTestService
        }
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
    expect(() => { pipe.transform(42.87549, options); }).toThrowError();
  });
});
