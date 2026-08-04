import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyChevronHarness } from '@skyux/indicators/testing';
import { SkyInlineFormHarness } from '@skyux/inline-form/testing';
import {
  SkyDropdownHarness,
  SkyDropdownHarnessFilters,
} from '@skyux/popovers/testing';

import { SkyRepeaterItemContextMenuHarness } from './repeater-item-context-menu-harness';
import { SkyRepeaterItemHarnessFilters } from './repeater-item-harness-filters';

/**
 * Harness for interacting with a repeater item component in tests.
 */
export class SkyRepeaterItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-repeater-item';

  #getBackToTop = this.locatorForOptional(
    'button.sky-repeater-item-reorder-top',
  );

  #getCheckbox = this.locatorForOptional(SkyCheckboxHarness);

  #getChevron = this.locatorForOptional(SkyChevronHarness);

  #getContent = this.locatorFor('.sky-repeater-item-content');

  #getContext = this.locatorFor(SkyRepeaterItemContextMenuHarness);

  #getItem = this.locatorFor('.sky-repeater-item');

  #getReorderHandle = this.locatorForOptional(
    'button.sky-repeater-item-grab-handle',
  );

  #getTitle = this.locatorFor('.sky-repeater-item-title');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRepeaterItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRepeaterItemHarnessFilters,
  ): HarnessPredicate<SkyRepeaterItemHarness> {
    return SkyRepeaterItemHarness.getDataSkyIdPredicate(filters)
      .addOption('contentText', filters.contentText, async (harness, text) => {
        const content = await harness.getContentText();
        return await HarnessPredicate.stringMatches(content, text);
      })
      .addOption('titleText', filters.titleText, async (harness, text) => {
        const title = await harness.getTitleText();
        return await HarnessPredicate.stringMatches(title, text);
      });
  }

  /**
   * Clicks on the repeater item.
   */
  public async click(): Promise<void> {
    await (await this.#getItem()).click();
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
      'Could not collapse the repeater item because it is not collapsible.',
    );
  }

  /**
   * Deselects the repeater item. Throws an error if the item belongs to a
   * single-select repeater, since a single-select item can only be replaced
   * by selecting a different item, not cleared directly.
   */
  public async deselect(): Promise<void> {
    const checkbox = await this.#getCheckbox();
    if (checkbox) {
      await checkbox.uncheck();
      return;
    }

    if (await this.#isSingleSelectItem()) {
      throw new Error(
        'Could not deselect the repeater item because single-select repeater items can only be replaced by selecting a different item.',
      );
    }

    throw new Error(
      'Could not deselect the repeater item because it is not selectable.',
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
      'Could not expand the repeater item because it is not collapsible.',
    );
  }

  /**
   * Gets a harness for the dropdown inside the context menu.
   */
  public async getContextMenuDropdown(
    filters?: SkyDropdownHarnessFilters,
  ): Promise<SkyDropdownHarness> {
    return await (
      await this.#getContext()
    ).queryHarness(SkyDropdownHarness.with(filters || {}));
  }

  /**
   * Gets the text of the repeater item content.
   */
  public async getContentText(): Promise<string> {
    return await (await this.#getContent()).text();
  }

  /**
   * Gets the inline form harness.
   */
  public async getInlineForm(): Promise<SkyInlineFormHarness> {
    return await this.locatorFor(SkyInlineFormHarness)();
  }

  /**
   * Gets the item name.
   */
  public async getItemName(): Promise<string | null> {
    return await (await this.#getItem()).getAttribute('aria-label');
  }

  /**
   * Gets the text of the repeater item title.
   */
  public async getTitleText(): Promise<string> {
    return await (await this.#getTitle()).text();
  }

  /**
   * Whether the repeater item is collapsible.
   */
  public async isCollapsible(): Promise<boolean> {
    return !!(await this.#getChevron());
  }

  /**
   * Whether a selectable repeater item is disabled, either via a checkbox's disabled state, or,
   * for a single-select repeater item, via the `aria-disabled` attribute on the item's row.
   */
  public async isDisabled(): Promise<boolean> {
    const checkbox = await this.#getCheckbox();
    if (checkbox) {
      return await checkbox.isDisabled();
    }

    if (await this.#isSingleSelectItem()) {
      return (
        (await (await this.#getItem()).getAttribute('aria-disabled')) === 'true'
      );
    }

    return false;
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
      'Could not determine if repeater item is expanded because it is not collapsible.',
    );
  }

  /**
   * Whether the repeater item is reorderable.
   */
  public async isReorderable(): Promise<boolean> {
    return !!(await this.#getReorderHandle());
  }

  /**
   * Whether a repeater item has selection enabled, either via a checkbox
   * (the item's `selectable` property) or via the repeater's `selectionMode`
   * property set to `single`.
   */
  public async isSelectable(): Promise<boolean> {
    if (await this.#getCheckbox()) {
      return true;
    }

    return await this.#isSingleSelectItem();
  }

  /**
   * Whether a selectable repeater item is selected. Throws an error if the item is not selectable.
   */
  public async isSelected(): Promise<boolean> {
    const checkbox = await this.#getCheckbox();
    if (checkbox) {
      return await checkbox.isChecked();
    }

    if (await this.#isSingleSelectItem()) {
      const ariaSelected = await (
        await this.#getItem()
      ).getAttribute('aria-selected');
      return ariaSelected === 'true';
    }

    throw new Error(
      'Could not determine if repeater item is selected because it is not selectable.',
    );
  }

  /**
   * Selects the repeater item. For a checkbox-selectable item, checks its
   * checkbox. For a single-select repeater item, clicks the item, which also
   * clears any previously selected item.
   */
  public async select(): Promise<void> {
    const checkbox = await this.#getCheckbox();
    if (checkbox) {
      await checkbox.check();
      return;
    }

    const isSingleSelectItem = await this.#isSingleSelectItem();
    if (isSingleSelectItem) {
      await this.click();
      return;
    }

    throw new Error(
      'Could not select the repeater item because it is not selectable.',
    );
  }

  /**
   * Moves the repeater item to the top of the list
   */
  public async sendToTop(): Promise<void> {
    if (await this.isReorderable()) {
      await (await this.#getBackToTop())?.click();
    } else {
      throw new Error(
        'Could not send to top because the repeater is not reorderable.',
      );
    }
  }

  async #isSingleSelectItem(): Promise<boolean> {
    return await (
      await this.#getItem()
    ).hasClass('sky-repeater-item-selection-single');
  }
}
