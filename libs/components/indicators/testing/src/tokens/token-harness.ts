import { ComponentHarness } from '@angular/cdk/testing';

export class SkyTokenHarness extends ComponentHarness {
  public static hostSelector = 'sky-token';

  public async close(): Promise<void> {
    const button = await (
      await this.locatorFor('button.sky-token-btn-close')
    )();
    button.click();
  }
}
