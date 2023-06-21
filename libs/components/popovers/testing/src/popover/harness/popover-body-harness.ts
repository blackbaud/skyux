import {
  ComponentHarness,
  HarnessQuery,
  TestElement,
} from '@angular/cdk/testing';

/**
 * Harness for interacting with a popover body in tests.
 * @internal
 */
export class SkyPopoverBodyHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-popover-body';

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
  ): Promise<T[]> {
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

  /**
   * Gets the text of the popover content body.
   */
  public async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
