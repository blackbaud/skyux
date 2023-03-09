import * as iconManifest from '@skyux/icons/assets/manifest.json';

import { SkyThemeIconManifest } from './icon-manifest';
import { SkyThemeIconManifestService } from './icon-manifest.service';

const manifest: SkyThemeIconManifest = iconManifest;

describe('SKY theme icon manifest service', () => {
  let manifestSvc: SkyThemeIconManifestService;

  beforeEach(() => {
    manifestSvc = new SkyThemeIconManifestService();
  });

  it('should return the manifest file from the @skyux/icons package', () => {
    expect(manifestSvc.getManifest()).toEqual(
      jasmine.objectContaining(manifest)
    );
    console.log('1:', JSON.stringify(manifestSvc.getManifest()));
    console.log('\n\n', '2:', JSON.stringify(manifest));
    expect(manifestSvc.getManifest()).toEqual(manifest);
  });
});
