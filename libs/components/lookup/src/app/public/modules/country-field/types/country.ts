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

}
