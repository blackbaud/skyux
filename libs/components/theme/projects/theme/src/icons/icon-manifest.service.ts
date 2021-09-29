import {
  Injectable
} from '@angular/core';

import {
  SkyThemeIconManifest
} from './icon-manifest';

import iconManifest from '@skyux/icons/assets/manifest.json';
const manifest: SkyThemeIconManifest = iconManifest;

/**
 * Provides a method for retrieving metadata about the SKY UX icon font.
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class SkyThemeIconManifestService {

  constructor() { }

  /**
   * Gets metadata about the SKY UX icon font.
   */
  public getManifest(): SkyThemeIconManifest {
    return manifest;
  }
}
