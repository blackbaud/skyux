import { SkyI18nModule } from './i18n.module';
import { expect } from '@skyux-sdk/testing';

describe('SkyI18nModule', () => {
  it('should export', () => {
    const exportedModule = new SkyI18nModule();
    expect(exportedModule).toBeDefined();
  });
});
