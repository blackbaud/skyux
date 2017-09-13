import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { BBHelpModule } from './bb-help.module';

describe('BBHelpModule', () => {
  it('should export', () => {
    const exportedModule = new BBHelpModule();
    expect(exportedModule).toBeDefined();
  });
});
