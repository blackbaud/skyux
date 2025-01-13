import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyLinkListHarness } from '../link-list/link-list-harness';
import { SkyNeedsAttentionHarness } from '../needs-attention/needs-attention-harness';
import { SkyNeedsAttentionItemHarness } from '../needs-attention/needs-attention-item-harness';
import { SkyNeedsAttentionItemHarnessFilters } from '../needs-attention/needs-attention-item-harness-filters';
import { SkyPageHeaderHarness } from '../page-header/page-header-harness';

import { SkyActionHubHarnessFilters } from './action-hub-harness-filters';

/**
 * Harness for interacting with an action hub component in tests.
 */
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

  /**
   * Gets the title of the action hub.
   */
  public async getTitle(): Promise<string | undefined> {
    return await (await this.#pageHeader()).getPageTitle();
  }

  /**
   * Get the testing harness for the needs attention block.
   */
  public async getNeedsAttentionBlock(): Promise<SkyNeedsAttentionHarness> {
    return await this.#needsAttention();
  }

  /**
   * Get the testing harnesses for items within the needs attention block.
   */
  public async getNeedsAttentionItems(
    filter: SkyNeedsAttentionItemHarnessFilters = {},
  ): Promise<SkyNeedsAttentionItemHarness[]> {
    return await this.locatorForAll(
      SkyNeedsAttentionItemHarness.with(filter),
    )();
  }

  /**
   * Get the testing harness for the related links block.
   */
  public async getRelatedLinks(): Promise<SkyLinkListHarness> {
    return await this.#relatedLinks();
  }

  /**
   * Get the testing harness for the recent links block.
   */
  public async getRecentLinks(): Promise<SkyLinkListHarness> {
    return await this.#recentLinks();
  }

  /**
   * Get the testing harness for the settings links block.
   */
  public async getSettingsLinks(): Promise<SkyLinkListHarness> {
    return await this.#settingsLinks();
  }
}
