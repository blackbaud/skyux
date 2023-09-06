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
    themeSettings?: SkyThemeSettings
  ): SkyIconResolved {
    let iconType = 'fa';
    const variantIcon = variant && `${icon}-${variant}`;
    const lineIcon = `${icon}-line`;

    // Get the specified variant, or fall back to the line variant.
    // If the icon has no variants, try to fall back to the icon name without a variant suffix.
    // If no icon is found, fall back to the first glyph with the icon name as a FA alias.
    const glyph =
      this.#glyphMap.get(variantIcon as string) ??
      this.#glyphMap.get(lineIcon) ??
      this.#glyphMap.get(icon) ??
      Array.from(this.#glyphMap.values()).find(
        (glyph) =>
          glyph.faName === icon ||
          glyph.aliases?.includes(variantIcon as string) ||
          glyph.aliases?.includes(lineIcon) ||
          glyph.aliases?.includes(icon)
      );

    if (glyph) {
      // If a glyph is found, use it for modern theme or if no FA fallback exists.
      if (themeSettings?.theme.name === 'modern' || !glyph.faName) {
        icon = glyph.name;
        iconType = 'skyux';
      } else {
        // For default theme, use known FA fallback.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        icon = glyph.faName!;
      }
    }

    // If no SKY UX glyph is found, assume icon is part of FA and pass it along.
    return {
      icon,
      iconType,
    };
  }
}
