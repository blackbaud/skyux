import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a description list description component in tests.
 * @internal
 */
export class SkyDescriptionListDescriptionHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'dd';

  public async getText(): Promise<string> {
    const description = (
      await (
        await this.locatorFor('.sky-description-list-description')()
      ).text()
    ).trim();

    if (description === '') {
      return await (
        await this.locatorFor('.sky-description-list-default-value')()
      ).text();
    }
    return description;
  }
}
