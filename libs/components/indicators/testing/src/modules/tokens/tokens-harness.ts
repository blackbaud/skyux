import { HarnessPredicate } from '@angular/cdk/testing';
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
  public static with(
    filters: SkyTokensHarnessFilters,
  ): HarnessPredicate<SkyTokensHarness> {
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
   * Gets a specific token based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getToken(
    filter: SkyTokenHarnessFilters,
  ): Promise<SkyTokenHarness> {
    return await this.locatorFor(SkyTokenHarness.with(filter))();
  }

  /**
   * Gets an array of tokens based on the filter criteria.
   * If no filter is provided, returns all tokens.
   * @param filters The optional filter criteria.
   */
  public async getTokens(
    filters?: SkyTokenHarnessFilters,
  ): Promise<SkyTokenHarness[]> {
    return await this.locatorForAll(SkyTokenHarness.with(filters || {}))();
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
