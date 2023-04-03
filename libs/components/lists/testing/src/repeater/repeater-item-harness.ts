import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyChevronHarness } from '@skyux/indicators/testing';

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

  #getChevron = this.locatorForOptional(SkyChevronHarness);

  #getContent = this.locatorFor('.sky-repeater-item-content');

  #getReorderHandle = this.locatorForOptional(
    'button.sky-repeater-item-grab-handle'
  );

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
    const checkbox = await this.#getCheckbox();
    if (!checkbox) {
      throw new Error(
        'Could not determine if repeater item is selected because it is not selectable.'
      );
    }

    return checkbox.isChecked();
  }

  /**
   * Returns a child harness.
   */
  public async queryHarness<T extends ComponentHarness>(
    query: HarnessQuery<T>
  ): Promise<T | null> {
    return this.locatorForOptional(query)();
  }

  /**
   * Selects the repeater item.
   */
  public async select(): Promise<void> {
    const checkbox = await this.#getCheckbox();
    if (!checkbox) {
      throw new Error(
        'Could not select the repeater item because it is not selectable.'
      );
    }

    await checkbox.check();
  }

  /**
   * Deselects the repeater item.
   */
  public async deselect(): Promise<void> {
    const checkbox = await this.#getCheckbox();
    if (!checkbox) {
      throw new Error(
        'Could not deselect the repeater item because it is not selectable.'
      );
    }

    await checkbox.uncheck();
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

  /**
   * Whether the repeater item is collapsible.
   */
  public async isCollapsible(): Promise<boolean> {
    return !!(await this.#getChevron());
  }

  /**
   * Whether the repeater item is expanded, or throws an error informing of the lack of collapsibility.
   */
  public async isExpanded(): Promise<boolean> {
    const chevron = await this.#getChevron();
    if (chevron) {
      return (await chevron.getDirection()) === 'up';
    }
    throw new Error(
      'Could not determine if repeater item is expanded because it is not collapsible.'
    );
  }

  /**
   * Expands the repeater item, or does nothing if already expanded.
   */
  public async expand(): Promise<void> {
    const chevron = await this.#getChevron();
    if (chevron) {
      if ((await chevron.getDirection()) === 'down') {
        await chevron.toggle();
      }
      return;
    }
    throw new Error(
      'Could not expand the repeater item because it is not collapsible.'
    );
  }

  /**
   * Collapses the repeater item, or does nothing if already collapsed.
   */
  public async collapse(): Promise<void> {
    const chevron = await this.#getChevron();
    if (chevron) {
      if ((await chevron.getDirection()) === 'up') {
        await chevron.toggle();
      }
      return;
    }
    throw new Error(
      'Could not collapse the repeater item because it is not collapsible.'
    );
  }

  /**
   * Whether the repeater item is reorderable.
   */
  public async isReorderable(): Promise<boolean> {
    return !!(await this.#getReorderHandle());
  }
}
