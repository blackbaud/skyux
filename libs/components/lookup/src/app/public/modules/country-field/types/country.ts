/**
 * Represents the data for a given country.
 */
export interface SkyCountryFieldCountry {

  /**
   * The name of the country.
   * @required
   */
  name: string;

  /**
   *  The [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the country.
   * @required
   */
  iso2: string;
}
