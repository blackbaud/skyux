import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a back to top component in tests.
 */
export class SkyBackToTopHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-back-to-top';

  #getBackToTop = this.locatorFor('.sky-back-to-top button');

  /**
   * Clicks the back to top button.
   */
  public async clickBackToTop(): Promise<void> {
    return await (await this.#getBackToTop()).click();
  }
}
