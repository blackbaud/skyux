import {
  Pipe,
  PipeTransform
} from '@angular/core';

/**
 * This is the description for the FooPipe.
 * @example
 * ```markup
 * {{ myDate | foo }}
 * {{ myDate | foo:'medium' }}
 * {{ myDate | foo:'medium':'en-GA' }}
 * ```
 */
@Pipe({
  name: 'foo'
})
export class FooPipe implements PipeTransform {

  /**
   * Transforms the content.
   * @param value The date to transform.
   * @param format The date format to use.
   * @param locale The desired locale.
   */
  public transform(
    value: Date,
    format?: string,
    locale?: string
  ): string {
    return value.toDateString();
  }

}
