import { ComponentHarness } from '@angular/cdk/testing';

export class SkyCheckboxLabelHarness extends ComponentHarness {
  public static hostSelector = 'sky-checkbox-label';

  #getLabelContent = this.locatorFor('.sky-switch-label');

  public async getText(): Promise<string> {
    return (await this.#getLabelContent()).text();
  }
}
