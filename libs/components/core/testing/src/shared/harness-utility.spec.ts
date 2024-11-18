import { TestElement } from '@angular/cdk/testing';

import { SkyHarnessUtility } from './harness-utility';

describe('Harness utility', () => {
  async function validate(
    imageCss: string,
    imageUrl: string | undefined,
  ): Promise<void> {
    const el: Partial<TestElement> = {
      getCssValue: async (property) => {
        if (property === 'background-image') {
          return await Promise.resolve(imageCss);
        }

        return '';
      },
    };

    await expectAsync(
      SkyHarnessUtility.getBackgroundImageUrl(el as TestElement),
    ).toBeResolvedTo(imageUrl);
  }

  it('should get the background image of a test element', async () => {
    await validate(
      `url('https://example.com/bg.png')`,
      'https://example.com/bg.png',
    );

    await validate(
      'url("https://example.com/bg.png")',
      'https://example.com/bg.png',
    );

    await validate('url("blob:example.com/abc")', 'blob:example.com/abc');

    await validate('', undefined);
  });
});
