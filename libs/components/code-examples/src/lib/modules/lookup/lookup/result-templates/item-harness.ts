import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a lookup component in tests.
 * @internal
 */
export class ItemHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.lookup-example-template-item';

  #getName = this.locatorFor('.lookup-example-template-name');
  #getFormalName = this.locatorFor('.lookup-example-template-formal-name');

  public async getName(): Promise<string> {
    return await (await this.#getName()).text();
  }

  public async getFormalName(): Promise<string> {
    return await (await this.#getFormalName()).text();
  }
}
