import { getIconManifest } from '@skyux/icons';

import { SkyThemeIconManifestService } from './icon-manifest.service';

describe('SKY theme icon manifest service', () => {
  let manifestSvc: SkyThemeIconManifestService;

  beforeEach(() => {
    manifestSvc = new SkyThemeIconManifestService();
  });

  it('should return the manifest file from the @skyux/icons package', () => {
    expect(manifestSvc.getManifest()).toEqual(getIconManifest());
  });
});
