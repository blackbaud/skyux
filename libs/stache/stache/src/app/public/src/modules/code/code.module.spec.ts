import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheCodeModule } from './code.module';

describe('StacheCodeModule', () => {
  it('should export', () => {
    const exportedModule = new StacheCodeModule();
    expect(exportedModule).toBeDefined();
  });
});
