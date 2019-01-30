import { SkyClipboardModule } from './clipboard.module';

describe('SkyClipboardModule', () => {
  it('should export', () => {
    const exportedModule = new SkyClipboardModule();
    expect(exportedModule).toBeDefined();
  });
});
