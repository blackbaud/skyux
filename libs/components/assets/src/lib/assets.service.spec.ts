import { SkyAppAssetsService } from './assets.service';

describe('Assets service', () => {
  it('should have expected methods', () => {
    expect(SkyAppAssetsService.prototype).not.toBeNull();
    expect(SkyAppAssetsService.prototype.getUrl).not.toBeNull();
  });
});
