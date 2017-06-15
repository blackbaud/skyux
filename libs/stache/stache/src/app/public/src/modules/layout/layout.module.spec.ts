import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheLayoutModule } from './layout.module';

describe('StacheLayoutModule', () => {
  it('should export', () => {
    const exportedModule = new StacheLayoutModule();
    expect(exportedModule).toBeDefined();
  });
});
