import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheGridModule } from './grid.module';

describe('StacheGridModule', () => {
  it('should export', () => {
    const exportedModule = new StacheGridModule();
    expect(exportedModule).toBeDefined();
  });
});
