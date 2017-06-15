import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheWrapperModule } from './wrapper.module';

describe('StacheWrapperModule', () => {
  it('should export', () => {
    const exportedModule = new StacheWrapperModule();
    expect(exportedModule).toBeDefined();
  });
});
