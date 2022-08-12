import { SkyComponentHarness } from '@skyux/core/testing';

export class SkyInfiniteScrollHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-infinite-scroll';

  #showMoreButton = this.locatorFor(
    'button.sky-infinite-scroll-load-more-button'
  );

  public async loadMore(): Promise<void> {
    await (await this.#showMoreButton()).click();
  }
}
