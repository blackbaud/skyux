import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyPopoverContentHarness } from './popover-content-harness';
import { SkyPopoverHarnessFilters } from './popover-harness-filters';

/**
 * Harness for interacting with a popover component in tests.
 */
export class SkyPopoverHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-popover-trigger';

  #documentRootLocator = this.documentRootLocatorFactory();

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyPopoverHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyPopoverHarnessFilters,
  ): HarnessPredicate<SkyPopoverHarness> {
    return SkyPopoverHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Toggles a popover open or closed.
   */
  public async clickPopoverButton(): Promise<void> {
    await (await this.host()).click();
  }

  /**
   * Gets the popover content component.
   */
  public async getPopoverContent(): Promise<SkyPopoverContentHarness> {
    const content = await this.#getContent();
    if (!content) {
      throw new Error(
        'Unable to retrieve the popover content because the popover is not open.',
      );
    }
    return content;
  }

  /**
   * Whether the popover is open.
   */
  public async isOpen(): Promise<boolean> {
    return !!(await this.#getContent());
  }

  async #getContent(): Promise<SkyPopoverContentHarness | null> {
    const popoverId = await this.#getPopoverId();

    if (popoverId) {
      return await this.#documentRootLocator.locatorForOptional(
        SkyPopoverContentHarness.with({ selector: `#${popoverId}` }),
      )();
    }

    return null;
  }

  async #getPopoverId(): Promise<string | null | undefined> {
    const pointerId = await (await this.host()).getAttribute('aria-controls');
    const pointerEl = await this.#documentRootLocator.locatorForOptional(
      `#${pointerId}`,
    )();

    return await pointerEl?.getAttribute('aria-owns');
  }
}
