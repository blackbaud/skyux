import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyTextExpandRepeaterListStyleType } from '@skyux/layout';

import { SkyTextExpandRepeaterHarnessFilters } from './text-expand-repeater-harness-filters';
import { SkyTextExpandRepeaterItemHarness } from './text-expand-repeater-item-harness';

/**
 * Harness for interacting with a text expand repeater component in tests.
 */
export class SkyTextExpandRepeaterHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-text-expand-repeater';

  #getExpandCollapseButton = this.locatorForOptional(
    '.sky-text-expand-repeater-see-more',
  );
  #getOL = this.locatorForOptional('ol.sky-text-expand-repeater-container');
  #getUL = this.locatorForOptional('ul.sky-text-expand-repeater-container');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTextExpandRepeaterHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTextExpandRepeaterHarnessFilters,
  ): HarnessPredicate<SkyTextExpandRepeaterHarness> {
    return SkyTextExpandRepeaterHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the button element that expands or collapses text.
   */
  public async clickExpandCollapseButton(): Promise<void> {
    const button = await this.#getExpandCollapseButton();

    if (button === null) {
      throw Error(
        'Could not find button element. The repeater does not contain enough elements to be expandable.',
      );
    }

    await button.click();
  }

  /**
   * Gets an array of container harnesses for the repeater items.
   */
  public async getItems(): Promise<SkyTextExpandRepeaterItemHarness[]> {
    return await this.locatorForAll(SkyTextExpandRepeaterItemHarness)();
  }

  /**
   * Gets the list style.
   */
  public async getListStyle(): Promise<SkyTextExpandRepeaterListStyleType> {
    let list = await this.#getOL();
    if (list) {
      return 'ordered';
    } else {
      list = await this.#getUL();
      return (await list?.hasClass('sky-text-expand-repeater-list-style-none'))
        ? 'unstyled'
        : 'unordered';
    }
  }

  /**
   * Whether the text is expanded.
   */
  public async isExpanded(): Promise<boolean> {
    return (
      (await (
        await this.#getExpandCollapseButton()
      )?.getAttribute('aria-expanded')) === 'true'
    );
  }
}
