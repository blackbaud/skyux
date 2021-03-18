import {
  Injectable
} from '@angular/core';

import {
  SkyThemeIconManifestGlyph,
  SkyThemeIconManifestService
} from '@skyux/theme';

import {
  SkyIconVariant
} from './icon-variant';

@Injectable()
export class SkyIconResolverService {

  private glyphMap = new Map<string, SkyThemeIconManifestGlyph>();

  constructor(manifestSvc: SkyThemeIconManifestService) {
    // Map the icons by name for more efficient lookup.
    for (const glyph of manifestSvc.getManifest().glyphs) {
      this.glyphMap.set(glyph.name, glyph);
    }
  }

  public resolveIcon(iconName: string, variant?: SkyIconVariant): string {
    const variantIconName = variant && `${iconName}-${variant}`;

    if (variantIconName && this.glyphMap.has(variantIconName)) {
      // A variant was specified and exists; return it.
      return variantIconName;
    }

    if (variant !== SkyIconVariant.Line && !this.glyphMap.has(iconName)) {
      // Either the solid variant was specified and doesn't exist, or no variant was
      // specified and a non-variant doesn't exist; fall back to the line variant.
      const lineIconName = `${iconName}-${SkyIconVariant.Line}`;

      if (this.glyphMap.has(lineIconName)) {
        return lineIconName;
      }
    }

    // Fall back to the icon name as-is.
    return iconName;
  }

}
