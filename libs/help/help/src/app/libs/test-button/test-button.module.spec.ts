import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { TestButtonModule } from './test-button.module';

describe('TestButtonModule', () => {
  it('should export', () => {
    const exportedModule = new TestButtonModule();
    expect(exportedModule).toBeDefined();
  });
});
