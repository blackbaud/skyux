import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a description list term component in tests.
 * @internal
 */
export class SkyDescriptionListTermHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'dt';

  public async getText(): Promise<string> {
    return await (await this.locatorFor('span.description-list-term')()).text();
  }
}
