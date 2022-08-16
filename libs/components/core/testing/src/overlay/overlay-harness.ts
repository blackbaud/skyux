import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
  TestElement,
} from '@angular/cdk/testing';

import { SkyOverlayHarnessFilters } from './overlay-harness-filters';

/**
 * Harness for interacting with an overlay component in tests.
 */
export class SkyOverlayHarness extends ComponentHarness {
  public static hostSelector = 'sky-overlay';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyOverlayHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyOverlayHarnessFilters
  ): HarnessPredicate<SkyOverlayHarness> {
    return new HarnessPredicate(SkyOverlayHarness, filters);
  }

  /**
   * Returns a child harness.
   */
  public async queryHarness<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T | null> {
    return this.locatorForOptional(harness)();
  }

  /**
   * Returns child harnesses.
   */
  public async queryHarnesses<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T[] | null> {
    return this.locatorForAll(harness)();
  }

  /**
   * Returns a child test element.
   */
  public async querySelector(selector: string): Promise<TestElement | null> {
    return this.locatorForOptional(selector)();
  }

  /**
   * Returns child test elements.
   */
  public async querySelectorAll(selector: string): Promise<TestElement[]> {
    return this.locatorForAll(selector)();
  }
}
