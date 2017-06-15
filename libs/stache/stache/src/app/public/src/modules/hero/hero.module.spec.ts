import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheHeroModule } from './hero.module';

describe('StacheHeroModule', () => {
  it('should export', () => {
    const exportedModule = new StacheHeroModule();
    expect(exportedModule).toBeDefined();
  });
});
