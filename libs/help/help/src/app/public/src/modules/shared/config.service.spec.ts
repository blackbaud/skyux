import { LibraryConfigService } from './config.service';

describe('LibraryConfigService', () => {
  it('should return configuration', () => {
    const configService = new LibraryConfigService();
    expect(configService).toBeDefined();
  });
});
