import { HarnessPredicate } from '@angular/cdk/testing';
import { TemplateRef } from '@angular/core';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyPopoverContentHarness,
  SkyPopoverHarness,
} from '@skyux/popovers/testing';

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
    if ((await this.getAriaControls()) === null) {
      throw new Error('aria-expanded is only set when `ariaControls` is set.');
    }

    return (await (
      await this.#getInlineHelpButton()
    ).getAttribute('aria-expanded')) === 'true'
      ? true
      : false;
  }

  public async getAriaLabel(): Promise<string | null> {
    return (await this.#getInlineHelpButton()).getAttribute('aria-label');
  }

  public async getLabelText(): Promise<string | undefined> {
    const ariaLabel = await (
      await this.#getInlineHelpButton()
    ).getAttribute('aria-label');

    if (ariaLabel?.startsWith('Show help content ')) {
      return ariaLabel.replace('Show help content for ', '');
    }

    return undefined;
  }

  private async getPopoverHarnessContent(): Promise<
    SkyPopoverContentHarness | undefined
  > {
    return (
      await this.locatorForOptional(SkyPopoverHarness)()
    )?.getPopoverContent();
  }

  public async getPopoverTitle(): Promise<string | undefined> {
    return (await await this.getPopoverHarnessContent())?.getTitleText();
  }

  public async getPopoverContent(): Promise<
    TemplateRef<unknown> | string | undefined
  > {
    return (await this.getPopoverHarnessContent())?.getBodyText();
  }
}
