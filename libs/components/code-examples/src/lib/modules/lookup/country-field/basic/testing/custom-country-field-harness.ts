import { ComponentHarness } from '@angular/cdk/testing';
import { SkyCountryFieldHarness } from '@skyux/lookup/testing';

export class CustomCountryFieldHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'app-custom-country-field';

  #getCountryField = this.locatorFor(SkyCountryFieldHarness);

  public async getUnitedSearchResultsText(
    searchText?: string,
  ): Promise<string[]> {
    const countryField = await this.#getCountryField();
    try {
      const filter = searchText ?? 'United';
      return await countryField.getSearchResultsText({ text: filter });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
