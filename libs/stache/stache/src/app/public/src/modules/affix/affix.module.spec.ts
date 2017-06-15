import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheAffixModule } from './affix.module';

describe('StacheAffixModule', () => {
  it('should export', () => {
    const exportedModule = new StacheAffixModule();
    expect(exportedModule).toBeDefined();
  });
});
