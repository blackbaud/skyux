import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheAnalyticsModule } from './analytics.module';

describe('StacheAnalyticsModule', () => {
  it('should export', () => {
    const exportedModule = new StacheAnalyticsModule();
    expect(exportedModule).toBeDefined();
  });
});
