import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTokenHarness } from './token-harness';
import { SkyTokenHarnessFilters } from './token-harness-filters';
import { SkyTokensHarnessFilters } from './tokens-harness-filters';

/**
 * Harness for interacting with a tokens component in tests.
 */
export class SkyTokensHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tokens';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTokensHarness` that meets certain criteria.
   */
  public static with(filters: SkyTokensHarnessFilters) {
    return SkyTokensHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Dismisses all tokens, or tokens that meet certain criteria.
   */
  public async dismissTokens(filters?: SkyTokenHarnessFilters): Promise<void> {
    const tokens = await this.getTokens(filters);
    for (const token of tokens) {
      await token.dismiss();
    }
  }

  /**
   * Returns a list of tokens.
   */
  public async getTokens(
    filters?: SkyTokenHarnessFilters
  ): Promise<SkyTokenHarness[]> {
    return this.locatorForAll(SkyTokenHarness.with(filters || {}))();
  }

  /**
   * Returns the text content of all tokens.
   */
  public async getTokensText(): Promise<string[]> {
    const tokens = await this.getTokens();
    const values: string[] = [];

    for (const token of tokens) {
      values.push(await token.getText());
    }

    return values;
  }
}
