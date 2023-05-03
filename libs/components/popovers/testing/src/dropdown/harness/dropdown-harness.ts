import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownHarnessFilters } from './dropdown-harness.filters';
import { SkyDropdownMenuHarness } from './dropdown-menu-harness';

export class SkyDropdownHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown';

  #documentRootLocator = this.documentRootLocatorFactory();

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
    const ariaExpanded = await (
      await this.#getDropdownButton()
    ).getAttribute('aria-expanded');

    if (ariaExpanded?.match(/true/)) return true;
    return false;
  }

  /**
   * Gets the id of the dropdown menu the button controls
   */
  public async getAriaControls(): Promise<string | null> {
    return (await this.#getDropdownButton()).getAttribute('aria-controls');
  }

  /**
   * Gets the dropdown menu component
   */
  public async getDropdownMenu(): Promise<SkyDropdownMenuHarness | null> {
    const dropdownMenuId = await this.getAriaControls();
    if (!dropdownMenuId) {
      throw new Error(
        'Unable to retrieve dropdown menu harness because dropdown is closed'
      );
    }
    return this.#documentRootLocator.locatorForOptional(
      SkyDropdownMenuHarness.with({ selector: `#${dropdownMenuId}` })
    )();
  }
}
