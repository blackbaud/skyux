import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheFooterModule } from './footer.module';

describe('StacheFootertModule', () => {
  it('should export', () => {
    const exportedModule = new StacheFooterModule();
    expect(exportedModule).toBeDefined();
  });
});
