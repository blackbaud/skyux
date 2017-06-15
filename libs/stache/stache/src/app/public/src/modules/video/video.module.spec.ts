import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheVideoModule } from './video.module';

describe('StacheVideoModule', () => {
  it('should export', () => {
    const exportedModule = new StacheVideoModule();
    expect(exportedModule).toBeDefined();
  });
});
