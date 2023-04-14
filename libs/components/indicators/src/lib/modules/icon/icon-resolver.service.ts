import { Injectable, inject } from '@angular/core';
import {
  SkyThemeIconManifestGlyph,
  SkyThemeIconManifestService,
  SkyThemeSettings,
} from '@skyux/theme';

import { SkyIconResolved } from './types/icon-resolved';
import type { SkyIconVariantType } from './types/icon-variant-type';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyIconResolverService {
  #glyphMap = new Map<string, SkyThemeIconManifestGlyph>();

  #manifestSvc = inject(SkyThemeIconManifestService);

  constructor() {
    // Map the icons by name for more efficient lookup.
    for (const glyph of this.#manifestSvc.getManifest().glyphs) {
      this.#glyphMap.set(glyph.name, glyph);
    }
  }

  public resolveIcon(
    icon: string,
    variant?: SkyIconVariantType,
    iconType?: string,
    themeSettings?: SkyThemeSettings
  ): SkyIconResolved {
    iconType ||= 'fa';

    if (iconType === 'skyux') {
      if (themeSettings?.theme.name === 'modern') {
        const variantIcon = variant && `${icon}-${variant}`;

        if (variantIcon && this.#glyphMap.has(variantIcon)) {
          // A variant was specified and exists; use it.
          icon = variantIcon;
        } else if (variant !== 'line' && !this.#glyphMap.has(icon)) {
          // Either the solid variant was specified and doesn't exist, or no variant was
          // specified and a non-variant doesn't exist; fall back to the line variant.
          const lineIcon = `${icon}-line`;

          if (this.#glyphMap.has(lineIcon)) {
            icon = lineIcon;
          }
        }
      } else {
        // Use the Font Awesome equivalent in default theme if one exists.
        const faName = this.#glyphMap.get(icon)?.faName;

        if (faName) {
          icon = faName;
          iconType = 'fa';
        }
      }
    }

    return {
      icon,
      iconType,
    };
  }
}
