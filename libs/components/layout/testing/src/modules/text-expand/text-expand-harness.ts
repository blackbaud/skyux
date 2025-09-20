import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTextExpandHarnessFilters } from './text-expand-harness-filters';
import { SkyTextExpandModalHarness } from './text-expand-modal-harness';

/**
 * Harness for interacting with a text expand component in tests.
 */
export class SkyTextExpandHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-text-expand';

  #documentRootLocator = this.documentRootLocatorFactory();
  #getExpandCollapseButton = this.locatorForOptional(
    '.sky-text-expand-see-more',
  );
  #getText = this.locatorFor('.sky-text-expand-text');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTextExpandHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTextExpandHarnessFilters,
  ): HarnessPredicate<SkyTextExpandHarness> {
    return SkyTextExpandHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the button element that expands or collapses text.
   */
  public async clickExpandCollapseButton(): Promise<void> {
    const button = await this.#getExpandCollapseButton();

    if (button === null) {
      throw Error('Could not find button element.');
    }

    await button.click();
  }

  /**
   * Gets the harness to interact with the modal expanded view.
   */
  public async getExpandedViewModal(): Promise<SkyTextExpandModalHarness> {
    const modal = await this.#documentRootLocator.locatorForOptional(
      SkyTextExpandModalHarness,
    )();

    if (modal === null) {
      throw Error('Could not find text expand modal.');
    }

    return modal;
  }

  /**
   * Gets the text content of the text expand.
   */
  public async getText(): Promise<string> {
    return await (await this.#getText()).text();
  }

  /**
   * Whether the text will expand to a modal.
   */
  public async textExpandsToModal(): Promise<boolean> {
    return (
      (await (
        await this.#getExpandCollapseButton()
      )?.getAttribute('aria-haspopup')) !== null
    );
  }

  /**
   * Whether the text is expanded.
   */
  public async isExpanded(): Promise<boolean> {
    if (await this.textExpandsToModal()) {
      try {
        await this.getExpandedViewModal();
        return true;
      } catch {
        return false;
      }
    }

    return (
      (await (
        await this.#getExpandCollapseButton()
      )?.getAttribute('aria-expanded')) === 'true'
    );
  }
}
