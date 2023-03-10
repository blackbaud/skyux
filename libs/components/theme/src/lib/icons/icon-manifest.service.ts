import { Injectable } from '@angular/core';
import * as iconManifest from '@skyux/icons/assets/manifest.json';

import type { SkyThemeIconManifest } from './icon-manifest';

const manifest: SkyThemeIconManifest = iconManifest;

/**
 * Provides a method for retrieving metadata about the SKY UX icon font.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyThemeIconManifestService {
  /**
   * Gets metadata about the SKY UX icon font.
   */
  public getManifest(): SkyThemeIconManifest {
    return manifest;
  }
}
