import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';

import { SkyRepeaterItemHarnessFilters } from './repeater-item-harness-filters';

/**
 * Harness for interacting with a repeater item component in tests.
 * @internal
 */
export class SkyRepeaterItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-repeater-item';

  #getCheckbox = this.locatorForOptional(SkyCheckboxHarness);

  #getContent = this.locatorFor('.sky-repeater-item-content');

  #getTitle = this.locatorFor('.sky-repeater-item-title');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRepeaterItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRepeaterItemHarnessFilters
  ): HarnessPredicate<SkyRepeaterItemHarness> {
    return SkyRepeaterItemHarness.getDataSkyIdPredicate(filters)
      .addOption('contentText', filters.contentText, async (harness, text) =>
        HarnessPredicate.stringMatches(await harness.getContentText(), text)
      )
      .addOption('titleText', filters.titleText, async (harness, text) =>
        HarnessPredicate.stringMatches(await harness.getTitleText(), text)
      );
  }

  /**
   * Whether the repeater item is selectable.
   */
  public async isSelectable(): Promise<boolean> {
    return !!(await this.#getCheckbox());
  }

  /**
   * Whether the repeater item is selected.
   */
  public async isSelected(): Promise<boolean> {
    if (!(await this.isSelectable())) {
      throw new Error(
        'Could not determine if repeater item is selected because it is not selectable.'
      );
    }

    return (await this.#getCheckbox()).isChecked();
  }

  /**
   * Selects the repeater item.
   */
  public async select() {
    if (!(await this.isSelectable())) {
      throw new Error(
        'Could not select the repeater item because it is not selectable.'
      );
    }

    await (await this.#getCheckbox()).check();
  }

  /**
   * Deselects the repeater item.
   */
  public async deselect(): Promise<void> {
    if (!(await this.isSelectable())) {
      throw new Error(
        'Could not deselect the repeater item because it is not selectable.'
      );
    }

    await (await this.#getCheckbox()).uncheck();
  }

  /**
   * Gets the text of the repeater item content.
   */
  public async getContentText(): Promise<string> {
    return (await this.#getContent()).text();
  }

  /**
   * Gets the text of the repeater item title.
   */
  public async getTitleText(): Promise<string> {
    return (await this.#getTitle()).text();
  }
}
