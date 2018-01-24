import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheLinkModule } from './link.module';

describe('StacheLinkModule', () => {
  it('should export', () => {
    const exportedModule = new StacheLinkModule();
    expect(exportedModule).toBeDefined();
  });
});
