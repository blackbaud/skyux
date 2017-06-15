import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTableOfContentsModule } from './table-of-contents.module';

describe('StacheTableOfContentsModule', () => {
  it('should export', () => {
    const exportedModule = new StacheTableOfContentsModule();
    expect(exportedModule).toBeDefined();
  });
});
