import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheBackToTopModule } from './back-to-top.module';

describe('StacheBackToTopModule', () => {
  it('should export', () => {
    const exportedModule = new StacheBackToTopModule();
    expect(exportedModule).toBeDefined();
  });
});
