import { BBHelpSharedModule } from './shared.module';

describe('BBHelpSharedModule', () => {
  it('should export', () => {
    const exportedModule = new BBHelpSharedModule();
    expect(exportedModule).toBeDefined();
  });
});
