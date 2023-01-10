import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyWaitHarnessFilters } from './wait-harness-filters';

/**
 * Harness for interacting with an wait component in tests.
 */
export class SkyWaitHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-wait';

  #getWaitMask = this.locatorForOptional('.sky-wait-mask');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyWaitHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyWaitHarnessFilters
  ): HarnessPredicate<SkyWaitHarness> {
    return SkyWaitHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the aria label for the wait component or throws an error if not waiting.
   */
  public async getAriaLabel(): Promise<string> {
    const waitMask = await this.#getWaitMask();
    if (waitMask) {
      return (
        (await waitMask.getAttribute('aria-label')) ||
        /* istanbul ignore next */
        ''
      );
    }
    throw new Error('The wait component is not currently visible.');
  }
}
