import { TestElement } from '@angular/cdk/testing';

export namespace SkyHarnessUtility {
  export async function getBackgroundImageUrl(
    el: TestElement,
  ): Promise<string | undefined> {
    const backgroundImage = await el.getCssValue('background-image');

    return /url\(('|")([^'"]+)('|")\)/gi.exec(backgroundImage)?.[2];
  }
}
