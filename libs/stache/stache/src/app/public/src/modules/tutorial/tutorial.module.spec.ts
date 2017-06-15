import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialModule } from './tutorial.module';

describe('StacheTutorialModule', () => {
  it('should export', () => {
    const exportedModule = new StacheTutorialModule();
    expect(exportedModule).toBeDefined();
  });
});
