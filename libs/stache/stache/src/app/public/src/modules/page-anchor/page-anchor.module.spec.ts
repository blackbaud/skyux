import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageAnchorModule } from './page-anchor.module';

describe('StachePageAnchorModule', () => {
  it('should export', () => {
    const exportedModule = new StachePageAnchorModule();
    expect(exportedModule).toBeDefined();
  });
});
