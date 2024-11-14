import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a lookup component in tests.
 * @internal
 */
export class ItemHarness extends ComponentHarness {
  public static hostSelector = '.lookup-demo-template-item';

  #getName = this.locatorFor('.lookup-demo-template-name');
  #getFormalName = this.locatorFor('.lookup-demo-template-formal-name');

  public async getName(): Promise<string> {
    return await (await this.#getName()).text();
  }

  public async getFormalName(): Promise<string> {
    return await (await this.#getFormalName()).text();
  }
}
