import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheInternalModule } from './internal.module';

describe('StacheInternalModule', () => {
  it('should export', () => {
    const exportedModule = new StacheInternalModule();
    expect(exportedModule).toBeDefined();
  });
});
