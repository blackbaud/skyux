import { HarnessPredicate } from '@angular/cdk/testing';
import { TemplateRef } from '@angular/core';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyPopoverHarness } from '@skyux/popovers/testing';

import { SkyHelpInlineHarnessFilters } from './help-inline-harness.filters';

export class SkyHelpInlineHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-help-inline';

  #getInlineHelpButton = this.locatorFor('.sky-help-inline');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyHelpInlineHarness` that meets certain criteria
   */
  public static with(
    filters: SkyHelpInlineHarnessFilters,
  ): HarnessPredicate<SkyHelpInlineHarness> {
    return SkyHelpInlineHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline icon button
   */
  public async click(): Promise<void> {
    await (await this.#getInlineHelpButton()).click();
  }

  public async getAriaControls(): Promise<string | null> {
    return (await this.#getInlineHelpButton()).getAttribute('aria-controls');
  }

  public async getAriaExpanded(): Promise<boolean> {
    return false;
  }

  public async getAriaLabel(): Promise<string | undefined> {
    return 'return';
  }

  public async getLabelText(): Promise<string | undefined> {
    return 'return';
  }

  public async getPopover(): Promise<SkyPopoverHarness | null> {
    return await this.locatorForOptional(SkyPopoverHarness)();
  }

  public async getPopoverTitle(): Promise<string | undefined> {
    return 'return';
  }

  public async getPopoverContent(): Promise<
    TemplateRef<unknown> | string | undefined
  > {
    return 'return';
  }
}
