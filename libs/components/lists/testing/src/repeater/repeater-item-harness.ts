import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';

import { SkyRepeaterItemHarnessFilters } from './repeater-item-harness-filters';

/**
 * Harness for interacting with a repeater item component in tests.
 */
export class SkyRepeaterItemHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-repeater-item';

  #getBody = this.locatorFor('.sky-repeater-item-content');

  #getCheckbox = this.locatorForOptional(SkyCheckboxHarness);

  #getTitle = this.locatorForOptional('.sky-repeater-item-title');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRepeaterItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRepeaterItemHarnessFilters
  ): HarnessPredicate<SkyRepeaterItemHarness> {
    return SkyRepeaterItemHarness.getDataSkyIdPredicate(filters)
      .addOption(
        'bodyTextContent',
        filters.bodyTextContent,
        async (harness, text) =>
          HarnessPredicate.stringMatches(
            await (await harness.#getBody()).text(),
            text
          )
      )
      .addOption('title', filters.title, async (harness, text) =>
        HarnessPredicate.stringMatches(
          await (await harness.#getTitle()).text(),
          text
        )
      );
  }

  public async isSelectable(): Promise<boolean> {
    return !!(await this.#getCheckbox());
  }

  public async select() {
    if (!(await this.isSelectable())) {
      throw new Error(
        'Cannot select the repeater item because it is not selectable.'
      );
    }

    await (await this.#getCheckbox()).check();
  }
}
