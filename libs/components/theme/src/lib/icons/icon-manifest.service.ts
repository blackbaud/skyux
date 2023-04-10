import { Injectable } from '@angular/core';
import { getIconManifest } from '@skyux/icons';

import { SkyThemeIconManifest } from './icon-manifest';

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
    return getIconManifest();
  }
}
