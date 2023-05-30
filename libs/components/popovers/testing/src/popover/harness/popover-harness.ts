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
  // Directives that take input arguments that aren't strings don't remain in the DOM
  public static hostSelector = '[ng-reflect-sky-popover]';

  #getContent = this.documentRootLocatorFactory().locatorForOptional(
    SkyPopoverContentHarness
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyPopoverHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyPopoverHarnessFilters
  ): HarnessPredicate<SkyPopoverHarness> {
    return SkyPopoverHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Opens a popover.
   */
  public async open(): Promise<void> {
    if (!(await this.isOpen())) {
      (await this.host()).click();
    }
  }

  /**
   * Closes a popover.
   */
  public async close(): Promise<void> {
    const content = await this.#getContent();
    if (content) {
      await content.clickOut();
    }
  }

  /**
   * Gets whether the popover is open.
   */
  public async isOpen(): Promise<boolean> {
    return !!(await this.#getContent());
  }

  public async getPopoverContent(): Promise<SkyPopoverContentHarness> {
    const content = await this.#getContent();
    if (!content) {
      throw new Error(
        'Unable to retrieve popover content harness because popover is not opened.'
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return content!;
  }
}
