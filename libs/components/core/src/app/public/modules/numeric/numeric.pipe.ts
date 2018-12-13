import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyNumericService
} from './numeric.service';

import {
  NumericOptions
} from './numeric.options';

/**
 * Shortens numbers to 1K, 1M, 1B, 1T and can format for currency.
 * Note: Be sure you have a space between the curly bracket surrounding the options object
 * and the two curly brackets closing the pipe or it will not work.
 */
@Pipe({
  name: 'skyNumeric'
})
export class SkyNumericPipe implements PipeTransform {

  constructor(
    private readonly skyNumeric: SkyNumericService
  ) { }

  public transform(value: number, config: any): string {
    const options = new NumericOptions();

    // The default number of digits is `1`. When truncate is disabled, set digits
    // to `0` to avoid the unnecessary addition of `.0` at the end of the formatted number.
    if (
      config &&
      config.truncate === false &&
      config.digits === undefined
    ) {
      config.digits = 0;
    }

    // If the minimum digits is less than the set maximum digits then throw an error
    if (
      config &&
      config.minDigits &&
      config.digits &&
      config.minDigits > config.digits
    ) {
      throw new Error(
        'The `digits` property must be greater than or equal to the `minDigits` property'
      );

    // If there is a minimum digits given but not a maximum then default the maximum to the minimum
    } else if (
      config &&
      config.minDigits &&
      !config.digits
    ) {
      config.digits = config.minDigits;
    }

    Object.assign(options, config);

    return this.skyNumeric.formatNumber(value, options);
  }
}
