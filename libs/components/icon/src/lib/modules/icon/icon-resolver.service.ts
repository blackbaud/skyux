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
      // TODO: keep this until `faName` is removed just in case any icons get added with the wrong shape
      if (glyph.faName && !glyph.faNames) {
        glyph.faNames = [glyph.faName];
      }
      this.#glyphMap.set(glyph.name, glyph);
    }
  }

  public resolveIcon(
    icon: string,
    variant?: SkyIconVariantType,
    themeSettings?: SkyThemeSettings,
  ): SkyIconResolved {
    let iconType = 'fa';
    const variantIcon = variant && `${icon}-${variant}`;
    const lineIcon = `${icon}-line`;

    // Get the specified variant, or fall back to the icon name.
    // If the pure icon name doesn't exist, try the line variant.
    let glyph =
      this.#glyphMap.get(variantIcon as string) ??
      this.#glyphMap.get(icon) ??
      this.#glyphMap.get(lineIcon) ??
      Array.from(this.#glyphMap.values()).find(
        (glyph) =>
          glyph.aliases?.includes(variantIcon as string) ||
          glyph.aliases?.includes(lineIcon) ||
          glyph.aliases?.includes(icon),
      );

    // If still no icon is found, search through the icons that match the FA name.
    if (!glyph) {
      let glyphs = Array.from(this.#glyphMap.values()).filter((g) =>
        g.faNames?.includes(icon),
      );
      if (glyphs.length) {
        if (glyphs.length > 1) {
          // If multiples are found, make sure we select the correct variant, if requested.
          // The icons are ordered such that the "default" variant will be the first one.
          if (variant) {
            const variantGlyph = glyphs.find((g) => g.name.endsWith(variant));
            if (variantGlyph) {
              glyphs = [variantGlyph];
            }
          }
        }
        glyph = glyphs[0];
      }
      // If none of the above works, no matching icon was found
    }

    if (glyph) {
      // If a glyph is found, use it for modern theme or if no FA fallback exists.
      if (themeSettings?.theme.name === 'modern' || !glyph.faNames?.length) {
        icon = glyph.name;
        iconType = 'skyux';
      } else {
        // For default theme, use a known FA fallback.
        // If the icon name requested is already a FA icon, just use it. Otherwise use the first one.
        if (!glyph.faNames?.includes(icon)) {
          icon = glyph.faNames[0];
        }
      }
    }

    // If no SKY UX glyph is found, assume icon is part of FA and pass it along.
    return {
      icon,
      iconType,
    };
  }
}
