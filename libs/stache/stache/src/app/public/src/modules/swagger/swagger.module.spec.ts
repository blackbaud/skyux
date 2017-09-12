import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheSwaggerModule } from './swagger.module';

describe('StacheSwaggerModule', () => {
  it('should export', () => {
    const exportedModule = new StacheSwaggerModule();
    expect(exportedModule).toBeDefined();
  });
});
