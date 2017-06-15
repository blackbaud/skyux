import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheModule } from './stache.module';

describe('StacheModule', () => {
  it('should export', () => {
    const exportedModule = new StacheModule();
    expect(exportedModule).toBeDefined();
  });
});
