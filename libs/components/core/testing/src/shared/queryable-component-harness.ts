import {
  ComponentHarness,
  HarnessQuery,
  TestElement,
} from '@angular/cdk/testing';

import { SkyComponentHarness } from './component-harness';

/**
 * @internal
 */
export abstract class SkyQueryableComponentHarness extends SkyComponentHarness {
  /**
   * Returns a child harness or throws an error if not found.
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

  /**
   * Returns a child test element or throws an error if not found.
   */
  public async querySelector(selector: string): Promise<TestElement | null> {
    return this.locatorFor(selector)();
  }

  /**
   * Returns a child test element or null if not found.
   */
  public async querySelectorOrNull(
    selector: string,
  ): Promise<TestElement | null> {
    return this.locatorForOptional(selector)();
  }

  /**
   * Returns child test elements.
   */
  public async querySelectorAll(selector: string): Promise<TestElement[]> {
    return this.locatorForAll(selector)();
  }
}
