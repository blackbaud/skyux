import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  NumericOptions
} from './numeric.options';

import {
  SkyNumericService
} from './numeric.service';

/*
 * Shortens numbers to 1K, 1M, 1B, 1T and can format for currency
 * All three arguments in the options object, Digits, format and ISO, are optional,
 * defaulting to 1, number and USD respectively
 * Usage:
 *  number_expression | skyNumeric[:numbericOptions]]]
 *
 *  options is an object to be passed in with the following parameters:
 *    digits
 *    format
 *    iso
 * Example:
 *  {{ 1075 | skyNumeric:{digits: 1, format: 'currency', iso: 'USD'} }}
 *  formats to: $1.1K
 * Example:
 *  {{ 2075000 | skyNumeric:{digits: 2} }}
 *  formats to: 2.08M
 * Note: Be sure you have a space between the curly bracket surrounding the options object
 * and the two curly brackets closing the pipe or it will not work.  Thanks angular pipes.
*/
@Pipe({
  name: 'skyNumeric'
})
export class SkyNumericPipe implements PipeTransform {

  constructor(
    private readonly skyNumeric: SkyNumericService
  ) { }

  public transform(
    value: number,
    optionsObject: any
  ): string {
    const options = new NumericOptions();

    if (optionsObject) {
      if (optionsObject.digits !== undefined) {
        options.digits = optionsObject.digits;
      }

      if (optionsObject.format !== undefined) {
        options.format = optionsObject.format;
      }

      if (optionsObject.iso !== undefined) {
        options.iso = optionsObject.iso;
      }
    }

    return this.skyNumeric.formatNumber(value, options);
  }
}
