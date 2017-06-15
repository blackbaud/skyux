import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheCodeBlockModule } from './code-block.module';

describe('StacheCodeBlockModule', () => {
  it('should export', () => {
    const exportedModule = new StacheCodeBlockModule();
    expect(exportedModule).toBeDefined();
  });
});
