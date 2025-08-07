import { ComponentHarness } from '@angular/cdk/testing';

export class CustomToastHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'app-toast-content-example';

  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }
}
