import { SkyThemeIconManifestGlyph } from './icon-manifest-glyph';

/**
 * Metadata about the SKY UX icon font.
 */
export interface SkyThemeIconManifest {
  /**
   * The prefix of the CSS class for each glyph.
   */
  cssPrefix: string;

  /**
   * A list of available glyphs.
   */
  glyphs: SkyThemeIconManifestGlyph[];

  /**
   * The name of the font as it is registered with the SKY UX stylesheet.
   */
  name: string;
}
