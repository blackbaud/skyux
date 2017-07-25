import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheSharedModule } from './shared.module';

describe('StacheSharedModule', () => {
  it('should export', () => {
    const exportedModule = new StacheSharedModule();
    expect(exportedModule).toBeDefined();
  });
});
