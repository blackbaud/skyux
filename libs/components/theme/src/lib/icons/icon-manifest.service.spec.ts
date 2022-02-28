import { SkyThemeIconManifestService } from './icon-manifest.service';

import manifest from '@skyux/icons/assets/manifest.json';

describe('SKY theme icon manifest service', () => {
  let manifestSvc: SkyThemeIconManifestService;

  beforeEach(() => {
    manifestSvc = new SkyThemeIconManifestService();
  });

  it('should return the manifest file from the @skyux/icons package', () => {
    expect(manifestSvc.getManifest()).toEqual(manifest);
  });
});
