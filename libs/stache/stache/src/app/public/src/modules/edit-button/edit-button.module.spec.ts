import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheEditButtonModule } from './edit-button.module';

describe('StacheEditButtonModule', () => {
  it('should export', () => {
    const exportedModule = new StacheEditButtonModule();
    expect(exportedModule).toBeDefined();
  });
});
