import * as iconManifest from '@skyux/icons/assets/manifest.json';

import type { SkyThemeIconManifest } from './icon-manifest';
import { SkyThemeIconManifestService } from './icon-manifest.service';

const manifest: SkyThemeIconManifest = iconManifest;

describe('SKY theme icon manifest service', () => {
  let manifestSvc: SkyThemeIconManifestService;

  beforeEach(() => {
    manifestSvc = new SkyThemeIconManifestService();
  });

  it('should return the manifest file from the @skyux/icons package', () => {
    expect(JSON.stringify(manifestSvc.getManifest())).toEqual(
      JSON.stringify(manifest)
    );
  });
});
