import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheSidebarModule } from './sidebar.module';

describe('StacheSidebarModule', () => {
  it('should export', () => {
    const exportedModule = new StacheSidebarModule();
    expect(exportedModule).toBeDefined();
  });
});
