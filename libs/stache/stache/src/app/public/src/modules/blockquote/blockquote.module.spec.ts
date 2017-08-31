import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheBlockquoteModule } from './blockquote.module';

describe('StacheBlockquoteModule', () => {
  it('should export', () => {
    const exportedModule = new StacheBlockquoteModule();
    expect(exportedModule).toBeDefined();
  });
});
