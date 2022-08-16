import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTokenHarness } from './token-harness';
import { SkyTokenHarnessFilters } from './token-harness-filters';
import { SkyTokensHarnessFilters } from './tokens-harness-filters';

export class SkyTokensHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-tokens';

  public static with(filters: SkyTokensHarnessFilters) {
    return SkyTokensHarness.getDataSkyIdPredicate(filters);
  }

  public async dismissTokens(filters?: SkyTokenHarnessFilters) {
    const tokens = await this.getTokens(filters);
    for (const token of tokens) {
      await token.dismiss();
    }
  }

  public async getTokens(
    filters?: SkyTokenHarnessFilters
  ): Promise<SkyTokenHarness[]> {
    return filters
      ? this.locatorForAll(SkyTokenHarness.with(filters))()
      : this.locatorForAll(SkyTokenHarness)();
  }

  public async getTokenTextValues(): Promise<string[]> {
    const tokens = await this.getTokens();
    const values: string[] = [];

    for (const token of tokens) {
      values.push(await (await token.host()).text());
    }

    return values;
  }
}
