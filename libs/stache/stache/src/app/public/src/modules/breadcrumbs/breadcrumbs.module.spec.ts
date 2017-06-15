import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheBreadcrumbsModule } from './breadcrumbs.module';

describe('StacheBreadcrumbsModule', () => {
  it('should export', () => {
    const exportedModule = new StacheBreadcrumbsModule();
    expect(exportedModule).toBeDefined();
  });
});
