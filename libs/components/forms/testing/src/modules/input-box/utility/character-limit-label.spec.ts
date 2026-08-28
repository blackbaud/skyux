import { TestElement } from '@angular/cdk/testing';

import { getCharacterLimitRatio } from './character-limit-label';

describe('Character limit label utility', () => {
  function createLabel(text: string): TestElement {
    return {
      text: (): Promise<string> => Promise.resolve(text),
    } as TestElement;
  }

  it('should throw when the label is not formatted as a ratio', async () => {
    await expectAsync(
      getCharacterLimitRatio(createLabel('not a ratio')),
    ).toBeRejectedWithError(
      'Expected the character limit label to read "count/limit" but found "not a ratio".',
    );
  });
});
