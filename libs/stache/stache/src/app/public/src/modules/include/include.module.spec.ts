import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheIncludeModule } from './include.module';

describe('StacheIncludeModule', () => {
  it('should export', () => {
    const exportedModule = new StacheIncludeModule();
    expect(exportedModule).toBeDefined();
  });
});
