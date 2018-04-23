import { HelpKeyModule } from './help-key.module';

describe('HelpKeyModule', () => {
  it('should export', () => {
    const exportedModule = new HelpKeyModule();
    expect(exportedModule).toBeDefined();
  });
});
