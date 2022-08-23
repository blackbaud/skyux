import { SkyTokensHarness } from '@skyux/indicators/testing';

import { SkyLookupSelectionHarness } from './lookup-selection-harness';

/**
 * Harness for interacting with a multiselect lookup's selections list in tests.
 */
export class SkyLookupSelectionsListHarness extends SkyTokensHarness {
  /**
   * Gets a list of selections.
   */
  public async getSelections(): Promise<SkyLookupSelectionHarness[]> {
    return super.getTokens();
  }

  /**
   * Dismisses the selections in the list.
   */
  public async dismissSelections(): Promise<void> {
    return super.dismissTokens();
  }

  /**
   * Gets the text content of all selections in the list.
   */
  public async getSelectionsText(): Promise<string[]> {
    return super.getTokensText();
  }
}
