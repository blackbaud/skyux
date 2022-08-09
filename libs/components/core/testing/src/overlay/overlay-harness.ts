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
    filters: SkyOverlayHarnessFilters
  ): HarnessPredicate<SkyOverlayHarness> {
    return new HarnessPredicate(SkyOverlayHarness, filters);
  }

  public async queryHarnesses<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T[]> {
    return (await this.locatorForAll(harness))();
  }

  public async querySelector(selector: string) {
    return (await this.locatorForOptional(selector))();
  }

  public async querySelectorAll(selector: string) {
    return (await this.locatorForAll(selector))();
  }
}
