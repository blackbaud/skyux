import { SkyAutocompleteHarness } from '../autocomplete-harness';

/**
 * Demonstrates how to expose the protected "add" and "show more" features
 * of the autocomplete harness (e.g. the lookup component harness).
 */
export class MyExtendsAutocompleteHarness extends SkyAutocompleteHarness {
  public static hostSelector = '.my-autocomplete-3';

  public async clickAddButton(): Promise<void> {
    return super.clickAddButton();
  }

  public async clickShowMoreButton(): Promise<void> {
    return super.clickShowMoreButton();
  }
}
