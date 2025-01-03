import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyLinkListHarness } from '../link-list/link-list-harness';
import { SkyNeedsAttentionHarness } from '../needs-attention/needs-attention-harness';
import { SkyNeedsAttentionItemHarness } from '../needs-attention/needs-attention-item-harness';
import { SkyNeedsAttentionItemHarnessFilters } from '../needs-attention/needs-attention-item-harness-filters';
import { SkyPageHeaderHarness } from '../page-header/page-header-harness';

import { SkyActionHubHarnessFilters } from './action-hub-harness-filters';

export class SkyActionHubHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-action-hub';

  readonly #pageHeader = this.locatorFor(SkyPageHeaderHarness);
  readonly #needsAttention = this.locatorFor(SkyNeedsAttentionHarness);
  readonly #relatedLinks = this.locatorFor(
    SkyLinkListHarness.with({
      selector: 'sky-page-links > sky-link-list',
    }),
  );
  readonly #recentLinks = this.locatorFor(
    SkyLinkListHarness.with({
      selector: 'sky-page-links > sky-link-list-recently-accessed',
    }),
  );
  readonly #settingsLinks = this.locatorFor(
    SkyLinkListHarness.with({
      selector: 'sky-page-links > sky-modal-link-list',
    }),
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLinkListHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyActionHubHarnessFilters,
  ): HarnessPredicate<SkyActionHubHarness> {
    return SkyActionHubHarness.getDataSkyIdPredicate(filters);
  }

  public async getHeader(): Promise<SkyPageHeaderHarness> {
    return await this.#pageHeader();
  }

  public async getNeedsAttentionBlock(): Promise<SkyNeedsAttentionHarness> {
    return await this.#needsAttention();
  }

  public async getNeedsAttentionItems(
    filter: SkyNeedsAttentionItemHarnessFilters = {},
  ): Promise<SkyNeedsAttentionItemHarness[]> {
    return await this.locatorForAll(
      SkyNeedsAttentionItemHarness.with(filter),
    )();
  }

  public async getRelatedLinks(): Promise<SkyLinkListHarness> {
    return await this.#relatedLinks();
  }

  public async getRecentLinks(): Promise<SkyLinkListHarness> {
    return await this.#recentLinks();
  }

  public async getSettingsLinks(): Promise<SkyLinkListHarness> {
    return await this.#settingsLinks();
  }
}
