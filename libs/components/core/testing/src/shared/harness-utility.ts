import { TestElement } from '@angular/cdk/testing';

export class SkyHarnessUtility {
  public static async getBackgroundImageUrl(
    el: TestElement,
  ): Promise<string | undefined> {
    const backgroundImage = await el.getCssValue('background-image');

    return /url\(('|")([^'"]+)('|")\)/gi.exec(backgroundImage)?.[2];
  }
}
