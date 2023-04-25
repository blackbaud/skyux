import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownHarnessFilters } from './dropdown-harness.filters';

export class SkyDropdownHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown';

  // #getDropdown = this.locatorFor('.sky-dropdown');
  #getDropdownButton = this.locatorFor('.sky-dropdown-button');
  // #getDropdownMenu = this.locatorFor('.sky-dropdown-menu');
  #getDropdownItems = this.locatorForAll('.sky-dropdown-item');
  #getOverlay = this.locatorFor('sky-overlay');

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

  public async getAriaLabel(): Promise<string | null> {
    return (await this.#getDropdownButton()).getAttribute('aria-label');
  }

  public async getTooltipTitle(): Promise<string | null> {
    return (await this.#getDropdownButton()).getAttribute('title');
  }

  // public async click(): Promise<void> {
  //   (await this.#getDropdownButton()).click();
  // }

  // public async isOpen(): Promise<boolean> {
  //   return (await this.#getOverlay()) ? true : false;
  // }

  // public async getItemsList(): Promise<TestElement[] | undefined> {
  //   return await this.#getDropdownItems();
  // }

  // public async getItemAtIndex(index: number): Promise<TestElement | undefined> {
  //   const itemsList = await this.getItemsList();

  //   return itemsList?.at(index);
  // }

  //TODO: how to get alignment?
}
