import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyIconHarness } from '@skyux/icon/testing';

import { SkyCheckboxHarness } from '../checkbox/checkbox-harness';
import { SkyRadioHarness } from '../radio/radio-harness';

import { SkySelectionBoxDescriptionHarness } from './selection-box-description-harness';
import { SkySelectionBoxHarnessFilters } from './selection-box-harness-filters';
import { SkySelectionBoxHeaderHarness } from './selection-box-header-harness';

/**
 * Harness to interact with a selection box component in tests.
 */
export class SkySelectionBoxHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-selection-box';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySelectionBoxHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySelectionBoxHarnessFilters,
  ): HarnessPredicate<SkySelectionBoxHarness> {
    return SkySelectionBoxHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the checkbox or radio harness for the selection box form control.
   */
  public async getControl(): Promise<SkyCheckboxHarness | SkyRadioHarness> {
    return await this.locatorFor(SkyCheckboxHarness, SkyRadioHarness)();
  }

  /**
   * Gets the selection box description text.
   */
  public async getDescriptionText(): Promise<string> {
    const text = await (
      await this.locatorForOptional(SkySelectionBoxDescriptionHarness)()
    )?.getText();
    return text ?? '';
  }

  /**
   * Gets the selection box header text.
   */
  public async getHeaderText(): Promise<string> {
    const text = await (
      await this.locatorForOptional(SkySelectionBoxHeaderHarness)()
    )?.getText();
    return text ?? '';
  }

  /**
   * Gets the selection box icon, if it exists.
   */
  public async getIcon(): Promise<SkyIconHarness | null> {
    return await this.locatorForOptional(SkyIconHarness)();
  }
}
