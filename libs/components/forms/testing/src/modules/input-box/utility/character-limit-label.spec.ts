import { TestElement } from '@angular/cdk/testing';

import { getCharacterLimitRatio } from './character-limit-label';

describe('Character limit label utility', () => {
  function createLabel(text: string): TestElement {
    return {
      text: (): Promise<string> => Promise.resolve(text),
    } as TestElement;
  }

  it('should parse the values a coerced character limit can produce', async () => {
    await expectAsync(
      getCharacterLimitRatio(createLabel('3/10')),
    ).toBeResolvedTo({ count: 3, limit: 10 });

    await expectAsync(
      getCharacterLimitRatio(createLabel('3/10.5')),
    ).toBeResolvedTo({ count: 3, limit: 10.5 });

    await expectAsync(
      getCharacterLimitRatio(createLabel('3/-1')),
    ).toBeResolvedTo({ count: 3, limit: -1 });
  });

  it('should throw when the label is not formatted as a ratio', async () => {
    await expectAsync(
      getCharacterLimitRatio(createLabel('not a ratio')),
    ).toBeRejectedWithError(
      'Expected the character limit label to read "count/limit" but found "not a ratio".',
    );

    await expectAsync(
      getCharacterLimitRatio(createLabel('a/10')),
    ).toBeRejectedWithError(
      'Expected the character limit label to read "count/limit" but found "a/10".',
    );

    await expectAsync(
      getCharacterLimitRatio(createLabel('3/b')),
    ).toBeRejectedWithError(
      'Expected the character limit label to read "count/limit" but found "3/b".',
    );
  });
});
