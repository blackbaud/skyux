import { BaseHarnessFilters, HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

interface SkyRepeaterItemHarnessFilters extends BaseHarnessFilters {
  textContent?: string | RegExp;
}

/**
 * @experimental
 */
export class SkyRepeaterItemHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-repeater-item';

  // TODO: Better to just query the DOM from the lookup fixture to get the search result?
  // How useful is searching for repeater items by their text content, generally?
  public static with(
    filters: SkyRepeaterItemHarnessFilters
  ): HarnessPredicate<SkyRepeaterItemHarness> {
    return SkyRepeaterItemHarness.getDataSkyIdPredicate(filters).addOption(
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
