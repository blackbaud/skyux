import { HelpModule } from './help.module';

describe('HelpModule', () => {
  it('should export', () => {
    const exportedModule = new HelpModule();
    expect(exportedModule).toBeDefined();
  });
});
