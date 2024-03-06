import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

import { SkyComponentHarness } from './component-harness';

/**
 * @internal
 */
export abstract class SkyQueryableComponentHarness extends SkyComponentHarness {
  /**
   * Returns a child harness or throws error if not found.
   */
  public async queryHarness<T extends ComponentHarness>(
    query: HarnessQuery<T>,
  ): Promise<T> {
    return this.locatorFor(query)();
  }

  /**
   * Returns a child harness or null if not found.
   */
  public async queryHarnessOrNull<T extends ComponentHarness>(
    query: HarnessQuery<T>,
  ): Promise<T | null> {
    return this.locatorForOptional(query)();
  }

  /**
   * Returns child harnesses.
   */
  public async queryHarnesses<T extends ComponentHarness>(
    harness: HarnessQuery<T>,
  ): Promise<T[]> {
    return this.locatorForAll(harness)();
  }
}
