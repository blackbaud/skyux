import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyInfiniteScrollHarnessFilters } from './infinite-scroll-harness-filters';

export class SkyInfiniteScrollHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-infinite-scroll';

  #showMoreButton = this.locatorFor(
    'button.sky-infinite-scroll-load-more-button'
  );

  public static with(filters: SkyInfiniteScrollHarnessFilters) {
    return this.getDataSkyIdPredicate(filters);
  }

  public async loadMore(): Promise<void> {
    return (await this.#showMoreButton()).click();
  }
}
