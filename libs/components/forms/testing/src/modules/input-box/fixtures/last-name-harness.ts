import { ComponentHarness } from '@angular/cdk/testing';

export class LastNameHarness extends ComponentHarness {
  public static hostSelector = '.my-last-name-field';

  public async value(): Promise<string> {
    return await (await this.host()).getProperty('value');
  }
}
