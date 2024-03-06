import { TestElement } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a popover body in tests.
 * @internal
 */
export class SkyPopoverBodyHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-popover-body';

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
