import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyTokenHarnessFilters } from './token-harness-filters';

export class SkyTokenHarness extends ComponentHarness {
  public static hostSelector = 'sky-token';

  public static with(
    filters: SkyTokenHarnessFilters
  ): HarnessPredicate<SkyTokenHarness> {
    return new HarnessPredicate(this, filters).addOption(
      'textContent',
      filters.textContent,
      async (harness, test) =>
        HarnessPredicate.stringMatches(
          await (await harness.host()).text(),
          test
        )
    );
  }

  public async close(): Promise<void> {
    const button = await (
      await this.locatorFor('button.sky-token-btn-close')
    )();
    button.click();
  }
}
