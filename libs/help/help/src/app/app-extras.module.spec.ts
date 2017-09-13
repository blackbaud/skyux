import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { AppExtrasModule } from './app-extras.module';

describe('AppExtrasModule', () => {
  it('should export', () => {
    const exportedModule = new AppExtrasModule();
    expect(exportedModule).toBeDefined();
  });
});
