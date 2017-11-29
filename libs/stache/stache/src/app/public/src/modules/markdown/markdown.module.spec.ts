import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheMarkdownModule } from './markdown.module';

describe('StacheMarkdownModule', () => {
  it('should export', () => {
    const exportedModule = new StacheMarkdownModule();
    expect(exportedModule).toBeDefined();
  });
});
