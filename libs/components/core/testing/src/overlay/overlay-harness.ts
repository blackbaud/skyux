import { HarnessPredicate, TestElement } from '@angular/cdk/testing';

import { SkyQueryableComponentHarness } from '../shared/queryable-component-harness';

import { SkyOverlayHarnessFilters } from './overlay-harness-filters';

/**
 * Harness for interacting with an overlay component in tests.
 * @internal
 */
export class SkyOverlayHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-overlay';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyOverlayHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyOverlayHarnessFilters,
  ): HarnessPredicate<SkyOverlayHarness> {
    return new HarnessPredicate(SkyOverlayHarness, filters);
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
