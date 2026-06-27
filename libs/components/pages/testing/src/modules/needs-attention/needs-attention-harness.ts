import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { SkyNeedsAttentionHarnessFilters } from './needs-attention-harness-filters';

/**
 * Harness for interacting with the needs-attention component in tests.
 */
export class SkyNeedsAttentionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-needs-attention';

  readonly #boxHarness = this.locatorFor(SkyBoxHarness);
  readonly #getList = this.locatorFor('ul.sky-needs-attention-list');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyNeedsAttentionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyNeedsAttentionHarnessFilters,
  ): HarnessPredicate<SkyNeedsAttentionHarness> {
    return SkyNeedsAttentionHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the component's heading text. If there are no links, this will return `undefined`.
   */
  public async getTitle(): Promise<string | undefined> {
    return await (await this.#boxHarness()).getHeadingText();
  }

  /**
   * Needs attention no longer shows an empty list, so this will always return `undefined`.
   * @deprecated
   */
  public async getEmptyListText(): Promise<string | undefined> {
    return await Promise.resolve(undefined);
  }

  /**
   * Whether the link list is showing a list of links.
   */
  public async hasItems(): Promise<boolean> {
    return await this.#getList().then(
      () => true,
      () => false,
    );
  }
}
