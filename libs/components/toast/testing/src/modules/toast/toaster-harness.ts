import { ComponentHarness } from '@angular/cdk/testing';

import { SkyToastHarness } from './toast-harness';

/**
 * Harness for interacting with toasts' host component in tests.
 * Use this harness to query and interact with `SkyToastHarness` for open toast components.
 */
export class SkyToasterHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-toaster';

  public async getNumberOfToasts(): Promise<number> {
    const toasts = await this.getToasts();
    return toasts.length;
  }

  /**
   * Gets all open toast harnesses.
   */
  public async getToasts(): Promise<SkyToastHarness[]> {
    return await this.locatorForAll(SkyToastHarness)();
  }

  /**
   * Gets a toast harness that matches the `message`.
   */
  public async getToastByMessage(message: string): Promise<SkyToastHarness> {
    return await this.locatorFor(SkyToastHarness.with({ message: message }))();
  }
}
