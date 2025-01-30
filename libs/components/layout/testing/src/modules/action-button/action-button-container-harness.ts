import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyActionButtonContainerAlignItemsType } from '@skyux/layout';

import { SkyActionButtonHarness } from './action-button-harness';

export class SkyActionButtonContainerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-action-button-container';

  public async getAlignment(): Promise<SkyActionButtonContainerAlignItemsType> {
    return (await (
      await this.locatorFor('.sky-action-button-flex')()
    ).hasClass('.sky-action-button-flex-align-left'))
      ? 'left'
      : 'center';
  }

  public async getActionButtons(): Promise<SkyActionButtonHarness[]> {
    return await this.locatorForAll(SkyActionButtonHarness)();
  }
}
