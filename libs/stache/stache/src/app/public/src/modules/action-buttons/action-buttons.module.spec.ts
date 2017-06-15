import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheActionButtonsModule } from './action-buttons.module';

describe('StacheActionButtonsModule', () => {
  it('should export', () => {
    const exportedModule = new StacheActionButtonsModule();
    expect(exportedModule).toBeDefined();
  });
});
