export interface SkyPhoneFieldCountry {
  /**
   * The country's
   * [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code.
   * @required
   */
  iso2: string;
  /**
   * The country's international dial code.
   */
  dialCode?: string;
  /**
   * A placeholder value to demonstrate the country's number format. This
   * value is `undefined` until a country is selected to validate against.
   */
  exampleNumber?: string;
  /**
   * The name of the country.
   */
  name?: string;
  // NOTE: We intentionally don't document these properties as they are internal use properties
  /**
   * @internal
   */
  priority?: number;
  /**
   * @internal
   */
  areaCodes?: string[];
}
