import { StacheClipboardModule } from './clipboard.module';

describe('StacheClipboardModule', () => {
  it('should export', () => {
    const exportedModule = new StacheClipboardModule();
    expect(exportedModule).toBeDefined();
  });
});
