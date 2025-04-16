import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTimepickerFilters } from './timepicker-harness-filters';
import { SkyTimepickerInputHarness } from './timepicker-input-harness';
import { SkyTimepickerSelectorHarness } from './timepicker-selector-harness';

/**
 * Harness for interacting with timepicker components in tests.
 */
export class SkyTimepickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-timepicker, .sky-input-group';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getSelectorButton = this.locatorFor('.sky-input-group-timepicker-btn');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTimepickerHarness` that meets certain criteria.
   *
   * These filters only work for standalone timepickers. For timepickers
   * wrapped inside `sky-input-box`, place filters on the input box instead and
   * query the timepicker using a `SkyInputBoxHarness`.
   * For the input box implementation, see the code example.
   */
  public static with(
    filters: SkyTimepickerFilters,
  ): HarnessPredicate<SkyTimepickerHarness> {
    return SkyTimepickerHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the selector button.
   */
  public async clickSelectorButton(): Promise<void> {
    return await (await this.#getSelectorButton()).click();
  }

  /**
   * Gets the `SkyTimepickerSelectorHarness` for the selector controlled by
   * the timepicker. Throws an error if the selector is not open.
   */
  public async getTimepickerSelector(): Promise<SkyTimepickerSelectorHarness> {
    const selector = await this.#getSelector();
    if (!selector) {
      throw new Error(
        'Unable to get timepicker selector because selector is closed.',
      );
    }
    return selector;
  }

  /**
   * Gets the timepicker input harness.
   */
  public async getControl(): Promise<SkyTimepickerInputHarness> {
    return await this.locatorFor(SkyTimepickerInputHarness)();
  }

  /**
   * Whether the timepicker calendar picker is open.
   */
  public async isTimepickerOpen(): Promise<boolean> {
    return !!(await this.#getSelector());
  }

  async #getAriaControls(): Promise<string | null> {
    return await (
      await this.#getSelectorButton()
    ).getAttribute('aria-controls');
  }

  async #getSelector(): Promise<SkyTimepickerSelectorHarness | null> {
    const selectorId = await this.#getAriaControls();

    if (selectorId) {
      return await this.#documentRootLocator.locatorFor(
        SkyTimepickerSelectorHarness.with({ selector: `#${selectorId}` }),
      )();
    }

    return null;
  }
}
