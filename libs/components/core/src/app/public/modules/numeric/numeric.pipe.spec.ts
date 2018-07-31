import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

import {
  // ComponentFixture,
  // inject,
  TestBed
} from '@angular/core/testing';

import {
  SkyNumericPipe
} from './numeric.pipe';

import {
  SkyNumericService
} from './numeric.service';

import {
  NumericOptions
} from './numeric.options';

// import {
//   TestBed
// } from '@angular/core/testing';

// import {
//   SkyNumericModule
// } from './numeric.module';

describe('Numeric pipe', () => {
  let pipe: any;
  let numericService: any;
  let expectedConfig: NumericOptions;
  // let pipe: SkyNumericPipe;
  // let fixture: ComponentFixture<SkyNumericPipe>;

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
        SkyNumericService
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
});
