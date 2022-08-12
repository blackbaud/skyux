import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyInputBoxHarnessFilters } from './input-box-harness-filters';

export class SkyInputBoxHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-input-box';

  public static with(
    filters: SkyInputBoxHarnessFilters
  ): HarnessPredicate<SkyInputBoxHarness> {
    return SkyInputBoxHarness.getDataSkyIdPredicate(filters);
  }

  public async getHarness<Q extends HarnessQuery<ComponentHarness>>(type: Q) {
    return (await this.locatorForOptional(type))();
  }
}
