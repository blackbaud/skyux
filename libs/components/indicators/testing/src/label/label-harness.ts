import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import type {
  SkyIndicatorDescriptionType,
  SkyLabelType,
} from '@skyux/indicators';

import { SkyLabelHarnessFilters } from './label-harness-filters';

/**
 * Harness for interacting with a label component in tests.
 * @internal
 */
export class SkyLabelHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-label';

  #getWrapper = this.locatorFor('.sky-label');
  #getTextEl = this.locatorFor('.sky-label-text');
  #getScreenReaderTextEl = this.locatorForOptional('.sky-screen-reader-only');

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
   * Gets the `labelType` of the label component.
   */
  public async getLabelType(): Promise<SkyLabelType> {
    const labelClasses = await (await this.#getWrapper()).getAttribute('class');

    if (labelClasses.includes('sky-label-success')) {
      return 'success';
    }
    if (labelClasses.includes('sky-label-danger')) {
      return 'danger';
    }

    if (labelClasses.includes('sky-label-warning')) {
      return 'warning';
    }
    return 'info';
  }

  /**
   * Gets the `descriptionType` of the label component.
   */
  public async getDescriptionType(): Promise<SkyIndicatorDescriptionType> {
    const srEl = await this.#getScreenReaderTextEl();

    if (!srEl) {
      return 'none';
    }

    const srText = await srEl.text();

    if (srText === 'Attention:') {
      return 'attention';
    }
    if (srText === 'Caution:') {
      return 'caution';
    }
    if (srText === 'Completed:') {
      return 'completed';
    }
    if (srText === 'Danger:') {
      return 'danger';
    }
    if (srText === 'Error:') {
      return 'error';
    }
    if (srText === 'Important information:') {
      return 'important-info';
    }
    if (srText === 'Important warning:') {
      return 'important-warning';
    }
    if (srText === 'Success:') {
      return 'success';
    }
    if (srText === 'Warning:') {
      return 'warning';
    }
    return 'custom';
  }

  /**
   * Gets the custom text used for the screen reader description of the label component icon.
   */
  public async getCustomDescription(): Promise<string> {
    const descriptionType = await this.getDescriptionType();

    if (descriptionType === 'custom') {
      const srEl = await this.#getScreenReaderTextEl();

      if (srEl) {
        return await srEl.text();
      }
    }

    return '';
  }
}
