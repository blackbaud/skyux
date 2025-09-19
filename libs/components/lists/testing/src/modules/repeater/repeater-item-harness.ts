import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyChevronHarness } from '@skyux/indicators/testing';
import { SkyInlineFormHarness } from '@skyux/inline-form/testing';

import { SkyRepeaterItemContentHarness } from './repeater-item-content-harness';
import { SkyRepeaterItemContentHarnessFilters } from './repeater-item-content-harness-filters';
import { SkyRepeaterItemContextMenuHarness } from './repeater-item-context-menu-harness';
import { SkyRepeaterItemContextMenuHarnessFilters } from './repeater-item-context-menu-harness-filters';
import { SkyRepeaterItemHarnessFilters } from './repeater-item-harness-filters';
import { SkyRepeaterItemTitleHarness } from './repeater-item-title-harness';
import { SkyRepeaterItemTitleHarnessFilters } from './repeater-item-title-harness-filters';

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
   * Deselects the repeater item.
   */
  public async deselect(): Promise<void> {
    const checkbox = await this.#getCheckbox();
    if (!checkbox) {
      throw new Error(
        'Could not deselect the repeater item because it is not selectable.',
      );
    }

    await checkbox.uncheck();
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
   * Gets a harness for the repeater item content component.
   */
  public async getContent(
    filters?: SkyRepeaterItemContentHarnessFilters,
  ): Promise<SkyRepeaterItemContentHarness> {
    return await this.locatorFor(
      SkyRepeaterItemContentHarness.with(filters || {}),
    )();
  }

  /**
   * Gets a harness for the repeater item context menu component.
   */
  public async getContextMenu(
    filters?: SkyRepeaterItemContextMenuHarnessFilters,
  ): Promise<SkyRepeaterItemContextMenuHarness> {
    return await this.locatorFor(
      SkyRepeaterItemContextMenuHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the text of the repeater item content.
   */
  public async getContentText(): Promise<string> {
    return await (await this.#getContent()).text();
  }

  /**
   * Gets the inline form. Will throw an error if the inline form does not exist.
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
   * Gets a harness for the repeater item title component.
   */
  public async getTitle(
    filters?: SkyRepeaterItemTitleHarnessFilters,
  ): Promise<SkyRepeaterItemTitleHarness> {
    return await this.locatorFor(
      SkyRepeaterItemTitleHarness.with(filters || {}),
    )();
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
   * Whether a selectable repeater item is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await (await this.#getCheckbox())?.isDisabled()) || false;
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
   * Whether a repeater item has selection enabled.
   */
  public async isSelectable(): Promise<boolean> {
    return !!(await this.#getCheckbox());
  }

  /**
   * Whether a selectable repeater item is selected. Throws an error if the item is not selectable.
   */
  public async isSelected(): Promise<boolean> {
    const checkbox = await this.#getCheckbox();
    if (!checkbox) {
      throw new Error(
        'Could not determine if repeater item is selected because it is not selectable.',
      );
    }

    return await checkbox.isChecked();
  }

  /**
   * Selects the repeater item.
   */
  public async select(): Promise<void> {
    const checkbox = await this.#getCheckbox();
    if (!checkbox) {
      throw new Error(
        'Could not select the repeater item because it is not selectable.',
      );
    }

    await checkbox.check();
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
}
