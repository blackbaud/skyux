import {
  SkyAppConfig,
  SkyuxPactConfig
} from './config';

describe('SkyAppConfig', () => {
  it('should export classes', () => {
    const appConfig = new SkyAppConfig();
    const pactConfig = new SkyuxPactConfig();
    expect(appConfig).toBeDefined();
    expect(pactConfig).toBeDefined();
  });
});
