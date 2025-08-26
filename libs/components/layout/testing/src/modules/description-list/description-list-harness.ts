import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyDescriptionListModeType } from '@skyux/layout';

import { SkyDescriptionListContentHarness } from './description-list-content-harness';
import { SkyDescriptionListHarnessFilters } from './description-list-harness-filters';

/**
 * Harness for interacting with a description list component in tests.
 */
export class SkyDescriptionListHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-description-list';

  #getListEl = this.locatorFor('.sky-description-list');
  #getContentEls = this.locatorForAll(SkyDescriptionListContentHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDescriptionListHarness` that meets certain criteria
   */
  public static with(
    filters: SkyDescriptionListHarnessFilters,
  ): HarnessPredicate<SkyDescriptionListHarness> {
    return SkyDescriptionListHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the description list's content items.
   */
  public async getContent(): Promise<SkyDescriptionListContentHarness[]> {
    const items = await this.#getContentEls();

    if (items.length === 0) {
      throw new Error('Unable to find any description list content.');
    }

    return items;
  }

  /**
   * Gets the mode of the description list.
   */
  public async getMode(): Promise<SkyDescriptionListModeType> {
    const listEl = await this.#getListEl();

    const longDescription = await listEl.hasClass(
      'sky-description-list-long-description-mode',
    );
    const horizontal = await listEl.hasClass(
      'sky-description-list-horizontal-mode',
    );

    if (longDescription) {
      return 'longDescription';
    } else if (horizontal) {
      return 'horizontal';
    } else {
      return 'vertical';
    }
  }
}
