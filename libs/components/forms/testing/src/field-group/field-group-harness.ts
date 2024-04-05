import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyFieldGroupHeadingLevel,
  SkyFieldGroupHeadingStyle,
} from '@skyux/forms';

import { SkyFieldGroupHarnessFilters } from './field-group-harness-filters';

/**
 * Harness for interacting with a field group component in tests.
 * @internal
 */
export class SkyFieldGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-field-group';

  #getLegend = this.locatorFor('legend');
  #getH3 = this.locatorForOptional('legend h3');
  #getH4 = this.locatorForOptional('legend h4');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFieldGroupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFieldGroupHarnessFilters,
  ): HarnessPredicate<SkyFieldGroupHarness> {
    return SkyFieldGroupHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the field group's label text. If the label is set via `labelText` and `labelHidden` is true,
   * the text will still be returned.
   */
  public async getLabelText(): Promise<string | undefined> {
    return (await this.#getLegend()).text();
  }

  /**
   * Whether the label is hidden.
   */
  public async getLabelHidden(): Promise<boolean> {
    return (await this.#getLegend()).hasClass('sky-screen-reader-only');
  }

  /**
   * Whether the field group is stacked.
   */
  public async getStacked(): Promise<boolean> {
    const host = await this.host();

    return host.hasClass('sky-margin-stacked-xl');
  }

  /**
   * The semantic heading level used in the legend.
   */
  public async getHeadingLevel(): Promise<SkyFieldGroupHeadingLevel> {
    const h3 = await this.#getH3();

    return h3 ? 3 : 4;
  }

  /**
   * The heading style used in the legend.
   */
  public async getHeadingStyle(): Promise<SkyFieldGroupHeadingStyle> {
    const heading = (await this.#getH3()) || (await this.#getH4());

    return (await heading?.hasClass('sky-font-heading-3')) ? 3 : 4;
  }
}
