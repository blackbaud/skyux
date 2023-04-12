import { SkyIconManifest } from '@skyux/icons';

import { SkyThemeIconManifestGlyph } from './icon-manifest-glyph';

export interface SkyThemeIconManifest extends SkyIconManifest {
  glyphs: SkyThemeIconManifestGlyph[];
}
