import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyIconHarness } from '@skyux/icon/testing';

import { SkyActionButtonHarnessFilters } from './action-button-harness.filters';

/**
 * Harness for interacting with a action button component in tests.
 */
export class SkyActionButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-action-button';

  #actionButton = this.locatorFor('.sky-action-button');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyActionButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyActionButtonHarnessFilters,
  ): HarnessPredicate<SkyActionButtonHarness> {
    return SkyActionButtonHarness.getDataSkyIdPredicate(filters).addOption(
      'header',
      filters.header,
      async (harness, header) => {
        const harnessHeaderText = await harness.getHeaderText();
        return await HarnessPredicate.stringMatches(harnessHeaderText, header);
      },
    );
  }

  /**
   * Clicks the action button.
   */
  public async click(): Promise<void> {
    return await (await this.#actionButton()).click();
  }

  /**
   * Gets the action button details text.
   */
  public async getDetailsText(): Promise<string | null> {
    const details = await this.locatorFor('sky-action-button-details')();
    return (await details.text()).trim();
  }

  /**
   * Gets the action button header text.
   */
  public async getHeaderText(): Promise<string | null> {
    const header = await this.locatorFor('.sky-action-button-header')();
    return (await header.text()).trim();
  }

  /**
   * Gets the action button icon type.
   */
  public async getIconType(): Promise<string | undefined> {
    const icon = await this.locatorFor(SkyIconHarness)();
    return await icon.getIconName();
  }

  /**
   * Gets the action button link.
   */
  public async getLink(): Promise<string | undefined> {
    return (await (await this.#actionButton()).getProperty('href')).trim();
  }
}
