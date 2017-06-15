import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageHeaderModule } from './page-header.module';

describe('StachePageHeaderModule', () => {
  it('should export', () => {
    const exportedModule = new StachePageHeaderModule();
    expect(exportedModule).toBeDefined();
  });
});
