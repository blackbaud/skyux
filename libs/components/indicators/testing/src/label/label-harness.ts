import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyLabelType } from '@skyux/indicators';

import { SkyLabelHarnessFilters } from './label-harness-filters';

/**
 * Harness for interacting with a label component in tests.
 * @internal
 */
export class SkyLabelHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-label';

  #getWrapper = this.locatorFor('.sky-label');
  #getTextEl = this.locatorFor('.sky-label-text');
  #getScreenReaderTextEl = this.locatorFor('.sky-screen-reader-only');

  // #getAccessibilityEl = this.locatorForAll

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLookupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyLabelHarnessFilters
  ): HarnessPredicate<SkyLabelHarness> {
    return SkyLabelHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the text of the label component.
   */
  public async getLabelText(): Promise<string> {
    return await (await this.#getTextEl()).text();
  }

  /**
   * Gets the screen reader text read in place of the icon of the label component.
   */
  public async getScreenReaderText(): Promise<string> {
    return await (await this.#getScreenReaderTextEl()).text();
  }

  /**
   * Gets the `labelType` of the label component.
   */
  public async getLabelType(): Promise<SkyLabelType> {
    const labelClasses = await (await this.#getWrapper()).getAttribute('class');

    if (labelClasses.includes('sky-label-success')) {
      return 'success';
    } else if (labelClasses.includes('sky-label-danger')) {
      return 'danger';
    } else if (labelClasses.includes('sky-label-warning')) {
      return 'warning';
    } else {
      return 'info';
    }
  }

  //   public async getScreenReaderText(): Promise<string> {
  //     return (await this.#getWrapper())
  //   }
}
