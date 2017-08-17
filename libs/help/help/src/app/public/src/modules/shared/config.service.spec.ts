import { BBHelpConfigService } from './config.service';

describe('BBHelpConfigService', () => {
  it('should return configuration', () => {
    const configService = new BBHelpConfigService();
    expect(configService).toBeDefined();
  });
});
