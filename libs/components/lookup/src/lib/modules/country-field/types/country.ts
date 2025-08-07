/**
 * Represents the data for a given country.
 */
export interface SkyCountryFieldCountry {
  /**
   *  The [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the country.
   * @required
   */
  iso2: string;

  /**
   * The name of the country.
   */
  name?: string;

  /**
   * The country's international dial code.
   * This property is only set when the country field is within a phone field.
   * @internal
   */
  dialCode?: string;

  // NOTE: We intentionally don't document these properties as they are internal use properties
  /**
   * @internal
   */
  areaCodes?: string[];

  /**
   * @internal
   */
  priority?: number;
}
