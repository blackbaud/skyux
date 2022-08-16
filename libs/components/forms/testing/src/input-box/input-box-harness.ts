import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
  TestElement,
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

  /**
   * Returns a child harness.
   */
  public async queryHarness<T extends ComponentHarness>(
    query: HarnessQuery<T>
  ): Promise<T | null> {
    return this.locatorForOptional(query)();
  }

  /**
   * Returns a child test element.
   */
  public async querySelector(selector: string): Promise<TestElement | null> {
    return this.locatorForOptional(selector)();
  }
}
