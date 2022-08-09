import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';

import { SkyOverlayHarnessFilters } from './overlay-harness-filters';

/**
 * @experimental
 */
export class SkyOverlayHarness extends ComponentHarness {
  public static hostSelector = 'sky-overlay';

  public static with(
    options: SkyOverlayHarnessFilters
  ): HarnessPredicate<SkyOverlayHarness> {
    return new HarnessPredicate(SkyOverlayHarness, options);
  }

  public async queryHarnesses<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T[]> {
    return (await this.locatorForAll(harness))();
  }

  public async queryAll(selector: string) {
    return (await this.locatorForAll(selector))();
  }
}
