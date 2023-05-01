import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness, SkyOverlayHarness } from '@skyux/core/testing';

import { SkyDropdownHarnessFilters } from './dropdown-harness.filters';
import { SkyDropdownMenuHarness } from './dropdown-menu-harness';

export class SkyDropdownHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown';

  #documentRootLocator = this.documentRootLocatorFactory();
  #getOverlay = this.#documentRootLocator.locatorForOptional(SkyOverlayHarness);

  #getDropdownButton = this.locatorFor('.sky-dropdown-button');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownHarness` that meets certain criteria
   */
  public static with(
    filters: SkyDropdownHarnessFilters
  ): HarnessPredicate<SkyDropdownHarness> {
    return SkyDropdownHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the dropdown button style
   */
  public async getButtonStyle(): Promise<string> {
    const button = await this.#getDropdownButton();

    if (await button.hasClass('sky-btn-primary')) return 'primary';
    if (await button.hasClass('sky-btn-link')) return 'link';
    return 'default';
  }

  /**
   * Gets the dropdown button type
   */
  public async getButtonType(): Promise<string> {
    const button = await this.#getDropdownButton();

    if (await button.hasClass('sky-dropdown-button-type-context-menu'))
      return 'context-menu';
    return 'select';
  }

  /**
   * Gets whether the dropdown is disabled
   */
  public async isDisabled(): Promise<boolean> {
    const button = await this.#getDropdownButton();

    return (await button.getProperty('disabled')) ? true : false;
  }

  /**
   * Gets the aria-label value
   */
  public async getAriaLabel(): Promise<string | null> {
    return (await this.#getDropdownButton()).getAttribute('aria-label');
  }

  /**
   * Gets the hover tooltip text
   */
  public async getTooltipTitle(): Promise<string | null> {
    return (await this.#getDropdownButton()).getAttribute('title');
  }

  /**
   * Clicks the dropdown button
   */
  public async clickDropdownButton(): Promise<void> {
    (await this.#getDropdownButton()).click();
  }

  /**
   * Gets whether the dropdown menu is open
   */
  public async isOpen(): Promise<boolean> {
    return (await this.#getOverlay()) ? true : false;
  }

  /**
   * Gets the dropdown menu component harness
   */
  public async getDropdownMenuHarness(
    id?: string
  ): Promise<SkyDropdownMenuHarness | null> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to retrieve menu items because dropdown is closed'
      );
    }

    const menuHarness = await overlay.queryHarness(
      SkyDropdownMenuHarness.with({ dataSkyId: id })
    );

    if (id && menuHarness === null) {
      throw new Error(`could not find dropdown menu with dataSkyId: ${id}`);
    }

    return menuHarness;
  }

  //TODO: how to get alignment?
}
