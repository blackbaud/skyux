import { SkyAutocompleteHarness } from '../autocomplete-harness';

/**
 * Demonstrates how to expose the protected "add" and "show more" features
 * of the autocomplete harness (e.g. the lookup component harness).
 */
export class MyExtendsAutocompleteHarness extends SkyAutocompleteHarness {
  public static override hostSelector = '.my-autocomplete-3';

  public override async clickAddButton(): Promise<void> {
    await super.clickAddButton();
  }

  public override async clickShowMoreButton(): Promise<void> {
    await super.clickShowMoreButton();
  }
}
