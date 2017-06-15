import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageSummaryModule } from './page-summary.module';

describe('StachePageSummaryModule', () => {
  it('should export', () => {
    const exportedModule = new StachePageSummaryModule();
    expect(exportedModule).toBeDefined();
  });
});
