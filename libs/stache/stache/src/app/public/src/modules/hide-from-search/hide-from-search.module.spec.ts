import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { StacheHideFromSearchModule } from './hide-from-search.module';

describe('StacheHideFromSearchModule', () => {
  it('should export', () => {
    const exportedModule = new StacheHideFromSearchModule();
    expect(exportedModule).toBeDefined();
  });
});
