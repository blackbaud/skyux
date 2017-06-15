import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheNavModule } from './nav.module';

describe('StacheNavModule', () => {
  it('should export', () => {
    const exportedModule = new StacheNavModule();
    expect(exportedModule).toBeDefined();
  });
});
