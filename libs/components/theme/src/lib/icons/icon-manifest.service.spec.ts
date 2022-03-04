import _manifest from '@skyux/icons/assets/manifest.json';

import { SkyThemeIconManifest } from './icon-manifest';
import { SkyThemeIconManifestService } from './icon-manifest.service';

const manifest: SkyThemeIconManifest = _manifest;

describe('SKY theme icon manifest service', () => {
  let manifestSvc: SkyThemeIconManifestService;

  beforeEach(() => {
    manifestSvc = new SkyThemeIconManifestService();
  });

  it('should return the manifest file from the @skyux/icons package', () => {
    expect(manifestSvc.getManifest()).toEqual(manifest);
  });
});
