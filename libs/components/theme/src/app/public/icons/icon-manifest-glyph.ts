/**
 * Metadata about a SKY UX icon glyph.
 */
export interface SkyThemeIconManifestGlyph {

  /**
   * The character code of the glyph.
   */
  code: number;

  /**
   * The name of the glyph.
   */
  name: string;

  /**
   * A list of descriptions of how the glyph should be used to adhere to SKY UX design patterns.
   */
  usage: string[];

}
