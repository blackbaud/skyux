import { BaseHarnessFilters, HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

interface SkyRepeaterItemHarnessFilters extends BaseHarnessFilters {
  textContent?: string | RegExp;
}

export class SkyRepeaterItemHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-repeater-item';

  public static with(
    filters: SkyRepeaterItemHarnessFilters
  ): HarnessPredicate<SkyRepeaterItemHarness> {
    return new HarnessPredicate(SkyRepeaterItemHarness, filters).addOption(
      'textContent',
      filters.textContent,
      async (harness, text) =>
        HarnessPredicate.stringMatches(
          await (await harness.host()).text(),
          text
        )
    );
  }

  public async select() {
    await (
      await (
        await this.locatorFor(
          '.sky-repeater-item-checkbox .sky-checkbox-wrapper'
        )
      )()
    ).click();
  }
}
