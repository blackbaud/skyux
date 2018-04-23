import { BBHelpModule } from './bb-help.module';

describe('BBHelpModule', () => {
  it('should export', () => {
    const exportedModule = new BBHelpModule();
    expect(exportedModule).toBeDefined();
  });
});
