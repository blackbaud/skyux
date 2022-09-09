import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';

import { SkyKeyInfoHarnessFilters } from './key-info-harness-filters';
import { SkyKeyInfoLabelHarness } from './key-info-label-harness';
import { SkyKeyInfoValueHarness } from './key-info-value-harness';

/**
 * Harness for interacting with a key info component in tests.
 * @internal
 */
export class SkyKeyInfoHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-key-info';

  #getLabel = this.locatorFor(SkyKeyInfoLabelHarness);
  #getValue = this.locatorFor(SkyKeyInfoValueHarness);
  #getWrapper = this.locatorFor('.sky-key-info');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyKeyInfoHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyKeyInfoHarnessFilters
  ): HarnessPredicate<SkyKeyInfoHarness> {
    return SkyKeyInfoHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the current value text.
   */
  public async getValueText(): Promise<string> {
    return await (await this.#getValue()).getText();
  }

  /**
   * Gets the current label text.
   */
  public async getLabelText(): Promise<string> {
    return await (await this.#getLabel()).getText();
  }

  /**
   * Gets the current layout type.
   */
  public async getLayout(): Promise<SkyKeyInfoLayoutType> {
    return (await (
      await this.#getWrapper()
    ).hasClass('sky-key-info-horizontal'))
      ? 'horizontal'
      : 'vertical';
  }
}
