import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyInfiniteScrollHarnessFilters } from './infinite-scroll-harness-filters';

/**
 * Harness for interacting with an infinite scroll component in tests.
 */
export class SkyInfiniteScrollHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-infinite-scroll';

  #showMoreButton = this.locatorForOptional(
    'button.sky-infinite-scroll-load-more-button',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInfiniteScrollHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyInfiniteScrollHarnessFilters,
  ): HarnessPredicate<SkyInfiniteScrollHarness> {
    return this.getDataSkyIdPredicate(filters);
  }

  /**
   * Whether the infinite scroll is enabled.
   */
  public async isEnabled(): Promise<boolean> {
    return (await this.locatorForOptional('.sky-infinite-scroll')()) !== null;
  }

  /**
   * Whether the infinite scroll is loading.
   */
  public async isLoading(): Promise<boolean> {
    return (await this.isEnabled()) && (await this.#showMoreButton()) === null;
  }

  /**
   * Clicks the "Load more" button.
   */
  public async loadMore(): Promise<void> {
    const button = await this.#showMoreButton();
    if (button) {
      await button.click();
    } else {
      if (!(await this.isEnabled())) {
        throw new Error(
          'Unable to click the "Load more" button because the infinite scroll is not enabled.',
        );
      } else {
        throw new Error(
          'Unable to click the "Load more" button because the infinite scroll is loading.',
        );
      }
    }
  }
}
