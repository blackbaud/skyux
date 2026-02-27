import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyDropdownButtonStyleType } from '@skyux/popovers';

import { SkyDropdownHarnessFilters } from './dropdown-harness.filters';
import { SkyDropdownMenuHarness } from './dropdown-menu-harness';

/**
 * Harness for interacting with a dropdown component in tests.
 */
export class SkyDropdownHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getDropdownButton = this.locatorFor(
    // Default trigger button
    '.sky-dropdown-button',
    // Custom trigger button
    '[skyDropdownTrigger]',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDropdownHarnessFilters,
  ): HarnessPredicate<SkyDropdownHarness> {
    return SkyDropdownHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the dropdown button.
   */
  public async clickDropdownButton(): Promise<void> {
    await (await this.#getDropdownButton()).click();
  }

  /**
   * Gets the aria-label value.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getDropdownButton()).getAttribute('aria-label');
  }

  /**
   * Gets the dropdown button style.
   */
  public async getButtonStyle(): Promise<SkyDropdownButtonStyleType> {
    const button = await this.#getDropdownButton();

    if (await button.hasClass('sky-btn-primary')) {
      return 'primary';
    }

    if (await button.hasClass('sky-btn-link')) {
      return 'link';
    }

    return 'default';
  }

  /**
   * Gets the dropdown button type.
   */
  public async getButtonType(): Promise<string> {
    const button = await this.#getDropdownButton();

    if (await button.hasClass('sky-dropdown-button-type-context-menu')) {
      return 'context-menu';
    }

    if (await button.hasClass('sky-dropdown-button-type-tab')) {
      return 'tab';
    }

    return 'select';
  }

  /**
   * Gets the dropdown menu component.
   */
  public async getDropdownMenu(): Promise<SkyDropdownMenuHarness> {
    const dropdownMenuId = await this.#getAriaControls();

    if (!dropdownMenuId) {
      throw new Error(
        'Unable to retrieve dropdown menu harness because dropdown is closed.',
      );
    }

    return await this.#documentRootLocator.locatorFor(
      SkyDropdownMenuHarness.with({ selector: `#${dropdownMenuId}` }),
    )();
  }

  /**
   * Gets the hover tooltip text.
   */
  public async getTitle(): Promise<string | null> {
    return await (await this.#getDropdownButton()).getAttribute('title');
  }

  /**
   * Gets whether the dropdown is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const button = await this.#getDropdownButton();

    return (await button.getProperty('disabled')) ? true : false;
  }

  /**
   * Gets whether the dropdown menu is open.
   */
  public async isOpen(): Promise<boolean> {
    const ariaExpanded = await (
      await this.#getDropdownButton()
    ).getAttribute('aria-expanded');

    if (ariaExpanded === 'true') {
      return true;
    }

    return false;
  }

  /**
   * Gets the element ID of the dropdown menu that the dropdown button controls.
   */
  async #getAriaControls(): Promise<string | null> {
    return await (
      await this.#getDropdownButton()
    ).getAttribute('aria-controls');
  }
}
