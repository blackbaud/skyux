import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyActionButtonContainerAlignItemsType } from '@skyux/layout';

import { SkyActionButtonContainerHarnessFilters } from './action-button-container-harness.filters';
import { SkyActionButtonHarness } from './action-button-harness';
import { SkyActionButtonHarnessFilters } from './action-button-harness.filters';

/**
 * Harness for interacting with a action button container component in tests.
 */
export class SkyActionButtonContainerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-action-button-container';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyActionButtonContainerHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyActionButtonContainerHarnessFilters,
  ): HarnessPredicate<SkyActionButtonContainerHarness> {
    return SkyActionButtonContainerHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets an action button that matches the given filter.
   */
  public async getActionButton(
    filter: SkyActionButtonHarnessFilters,
  ): Promise<SkyActionButtonHarness> {
    return await this.locatorFor(SkyActionButtonHarness.with(filter))();
  }

  /**
   * Gets the action buttons.
   */
  public async getActionButtons(
    filters?: SkyActionButtonHarnessFilters,
  ): Promise<SkyActionButtonHarness[]> {
    const buttons = await this.locatorForAll(
      SkyActionButtonHarness.with(filters || {}),
    )();

    if (buttons.length === 0 && filters) {
      throw new Error(
        `Unable to find any action buttons with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return buttons;
  }

  /**
   * Gets the alignment of the buttons inside the container.
   */
  public async getAlignment(): Promise<SkyActionButtonContainerAlignItemsType> {
    return (await (
      await this.locatorFor('.sky-action-button-flex')()
    ).hasClass('sky-action-button-flex-align-left'))
      ? 'left'
      : 'center';
  }
}
