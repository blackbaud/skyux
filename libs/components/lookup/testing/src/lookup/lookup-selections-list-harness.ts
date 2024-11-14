import { SkyTokensHarness } from '@skyux/indicators/testing';

import { SkyLookupSelectionHarness } from './lookup-selection-harness';

/**
 * Harness for interacting with multiselect lookup selections in tests.
 * @internal
 */
export class SkyLookupSelectionsListHarness extends SkyTokensHarness {
  /**
   * Gets a list of selections.
   */
  public async getSelections(): Promise<SkyLookupSelectionHarness[]> {
    return await super.getTokens();
  }

  /**
   * Dismisses the selections in the list.
   */
  public async dismissSelections(): Promise<void> {
    await super.dismissTokens();
  }

  /**
   * Gets the text content of all selections in the list.
   */
  public async getSelectionsText(): Promise<string[]> {
    return await super.getTokensText();
  }
}
