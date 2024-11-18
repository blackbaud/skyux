import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyWaitHarnessFilters } from './wait-harness-filters';

/**
 * Harness for interacting with a wait component in tests.
 */
export class SkyWaitHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-wait';

  #getWaitMask = this.locatorForOptional('.sky-wait-mask');
  #getWaitContainer = this.locatorFor('.sky-wait-container');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyWaitHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyWaitHarnessFilters,
  ): HarnessPredicate<SkyWaitHarness> {
    if (filters.servicePageWaitType === 'blocking') {
      return SkyWaitHarness.getDataSkyIdPredicate({
        dataSkyId: 'page-wait-blocking',
      });
    } else if (filters.servicePageWaitType === 'non-blocking') {
      return SkyWaitHarness.getDataSkyIdPredicate({
        dataSkyId: 'page-wait-non-blocking',
      });
    }
    return SkyWaitHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the ARIA label for the wait component or throws an error if not waiting.
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
    throw new Error(
      'An ARIA label cannot be determined because the wait component is not visible.',
    );
  }

  /**
   * Gets the waiting state of the wait component.
   */
  public async isWaiting(): Promise<boolean> {
    return !!(await this.#getWaitMask());
  }

  /**
   * Gets the full page state of the wait component.
   */
  public async isFullPage(): Promise<boolean> {
    return await (
      await this.#getWaitContainer()
    ).hasClass('sky-wait-full-page');
  }

  /**
   * Gets the blocking state of the wait component.
   */
  public async isNonBlocking(): Promise<boolean> {
    return await (
      await this.#getWaitContainer()
    ).hasClass('sky-wait-non-blocking');
  }
}
