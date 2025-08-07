import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyRepeaterItemHarness } from '@skyux/lists/testing';

import { SkyDataManagerColumnPickerColumnHarnessFilters } from './data-manager-column-picker-column-harness-filters';

/**
 * Harness for interacting with a data manager column picker column result in tests.
 */
export class SkyDataManagerColumnPickerColumnHarness extends SkyRepeaterItemHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataManagerColumnPickerColumnHarness` that meets certain criteria.
   */
  public static override with(
    filters: SkyDataManagerColumnPickerColumnHarnessFilters,
  ): HarnessPredicate<SkyDataManagerColumnPickerColumnHarness> {
    return new HarnessPredicate<SkyDataManagerColumnPickerColumnHarness>(
      this,
      filters,
    )
      .addOption('titleText', filters.titleText, async (harness, text) => {
        const content = await harness.getTitleText();
        return await HarnessPredicate.stringMatches(content, text);
      })
      .addOption('contentText', filters.contentText, async (harness, text) => {
        const content = await harness.getContentText();
        return await HarnessPredicate.stringMatches(content, text);
      });
  }

  /**
   * Clicks on the column.
   * This has no effect in the data manager column picker.
   * @internal
   */
  /* istanbul ignore next */
  public override async click(): Promise<void> {
    await super.click();
  }

  /**
   * Collapses the search, or does nothing if already collapsed.
   * The data manager column picker does not use an expandable repeater.
   * @internal
   */
  /* istanbul ignore next */
  public override async collapse(): Promise<void> {
    await super.collapse();
  }

  /**
   * Deselects the column.
   */
  public override async deselect(): Promise<void> {
    await super.deselect();
  }

  /**
   * Expands the search, or does nothing if already expanded.
   * The data manager column picker does not use an expandable repeater.
   * @internal
   */
  /* istanbul ignore next */
  public override async expand(): Promise<void> {
    await super.expand();
  }

  /**
   * Gets the text of the column content.
   */
  public override async getContentText(): Promise<string> {
    return await super.getContentText();
  }

  /**
   * Gets the text of the column title.
   */
  public override async getTitleText(): Promise<string> {
    return await super.getTitleText();
  }

  /**
   * Whether the column is collapsible.
   * This is always false for data manager column picker and not documented.
   * @internal
   */
  /* istanbul ignore next */
  public override async isCollapsible(): Promise<boolean> {
    return await super.isCollapsible();
  }

  /**
   * Whether the column is expanded, or throws an error informing of the lack of collapsibility.
   * This is always true for data manager column picker and not documented.
   * @internal
   */
  /* istanbul ignore next */
  public override async isExpanded(): Promise<boolean> {
    return await super.isExpanded();
  }

  /**
   * Whether the repeater item is reorderable.
   * This is always false for data manager column picker and not documented.
   * @internal
   */
  /* istanbul ignore next */
  public override async isReorderable(): Promise<boolean> {
    return await super.isReorderable();
  }

  /**
   * Whether the column is selectable.
   * This is always true for data manager column picker and not documented.
   * @internal
   */
  /* istanbul ignore next */
  public override async isSelectable(): Promise<boolean> {
    return await super.isSelectable();
  }

  /**
   * Whether the column is selected.
   */
  public override async isSelected(): Promise<boolean> {
    return await super.isSelected();
  }

  /**
   * Selects the column.
   */
  public override async select(): Promise<void> {
    await super.select();
  }

  /**
   * Moves the column to the top of the list.
   * The data manager column picker does not use a reorderable repeater.
   * @internal
   */
  /* istanbul ignore next */
  public override async sendToTop(): Promise<void> {
    await super.sendToTop();
  }
}
