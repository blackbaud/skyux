import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyBoxHarnessFilters } from './box-harness.filters';

export class SkyBoxHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-box';

  #getBox = this.locatorFor('.sky-box');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyBoxHarness` that meets certain criteria
   */
  public static with(
    filters: SkyBoxHarnessFilters
  ): HarnessPredicate<SkyBoxHarness> {
    return SkyBoxHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the aria-label property of the box
   */
  public async getAriaLabel(): Promise<string | null> {
    return (await this.#getBox()).getAttribute('aria-label');
  }

  /**
   * Gets the aria-labelledby property of the box
   */
  public async getAriaLabelledby(): Promise<string | null> {
    return (await this.#getBox()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the aria-role property of the box
   */
  public async getAriaRole(): Promise<string | null> {
    return (await this.#getBox()).getAttribute('role');
  }
}
