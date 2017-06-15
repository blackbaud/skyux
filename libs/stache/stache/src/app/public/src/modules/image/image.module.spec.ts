import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheImageModule } from './image.module';

describe('StacheImageModule', () => {
  it('should export', () => {
    const exportedModule = new StacheImageModule();
    expect(exportedModule).toBeDefined();
  });
});
