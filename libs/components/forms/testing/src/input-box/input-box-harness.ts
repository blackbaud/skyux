import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyPopoverHarness } from '@skyux/popovers/testing';

import { SkyInputBoxHarnessFilters } from './input-box-harness-filters';

/**
 * Harness for interacting with an input box component in tests.
 * @internal
 */
export class SkyInputBoxHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-input-box';

  #getLabel = this.locatorForOptional('.sky-control-label');
  #getWrapper = this.locatorFor('.sky-input-box');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInputBoxHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyInputBoxHarnessFilters
  ): HarnessPredicate<SkyInputBoxHarness> {
    return SkyInputBoxHarness.getDataSkyIdPredicate(filters);
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
   * Indicates whether the input box has disabled styles applied.
   */
  public async getDisabled(): Promise<boolean> {
    const wrapper = await this.#getWrapper();

    return wrapper.hasClass('sky-input-box-disabled');
  }

  /**
   * Gets the text for the input box label.
   * @returns
   */
  public async getLabelText(): Promise<string> {
    const label = await this.#getLabel();

    return (await label?.text())?.trim() ?? '';
  }

  /**
   * Gets the help popover for the input box or throws an error if
   * the help popover is not configured.
   */
  public async getHelpPopover(): Promise<SkyPopoverHarness> {
    const helpPopover = await this.locatorForOptional(
      new HarnessPredicate(SkyPopoverHarness, {
        ancestor: '.sky-control-help',
      })
    )();

    if (!helpPopover) {
      throw new Error('The input box does not have a help popover configured.');
    }

    return helpPopover;
  }

  /**
   * Indicates whether the input box has stacked styles applied.
   * @returns
   */
  public async getStacked(): Promise<boolean> {
    const host = await this.host();

    return host.hasClass('sky-margin-stacked-lg');
  }
}
