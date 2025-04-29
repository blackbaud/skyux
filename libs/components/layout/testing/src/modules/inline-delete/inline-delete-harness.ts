import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { SkyInlineDeleteHarnessFilters } from './inline-delete-harness.filters';

/**
 * Harness for interacting with an inline delete component in tests.
 */
export class SkyInlineDeleteHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-inline-delete';

  #getDeleteButton = this.locatorFor('button.sky-inline-delete-button');
  #getCancelButton = this.locatorFor('button.sky-btn-default');
  #waitHarness = this.locatorFor(SkyWaitHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInlineDeleteHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyInlineDeleteHarnessFilters,
  ): HarnessPredicate<SkyInlineDeleteHarness> {
    return SkyInlineDeleteHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the delete button.
   */
  public async clickDeleteButton(): Promise<void> {
    return await (await this.#getDeleteButton()).click();
  }

  /**
   * Clicks the cancel button.
   */
  public async clickCancelButton(): Promise<void> {
    return await (await this.#getCancelButton()).click();
  }

  /**
   * Whether the inline delete is pending.
   */
  public async isPending(): Promise<boolean> {
    return await (await this.#waitHarness()).isWaiting();
  }
}
