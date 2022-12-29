export interface SkyTextEditorStyleState {
  /**
   * Specifies the background color. Accepts any CSS color value.
   */
  backColor: string;

  /**
   * Specifies the font color. Accepts any CSS color value.
   */
  fontColor: string;

  /**
   * Specifies the font size in pixels.
   */
  fontSize: number;

  /**
   * Specifies the font family. Available values: `"Blackbaud Sans"`,
   * `"Arial"`, `"sans-serif"`, `"Arial Black"`, `"Courier New"`, and `"Times New Roman"`.
   */
  font: string;

  /**
   * Whether to make text bold.
   */
  boldState: boolean;

  /**
   * Whether to italicize text.
   */
  italicState: boolean;

  /**
   * Whether to underline text.
   */
  underlineState: boolean;

  /**
   * Whether to format text as a link.
   */
  linkState: boolean;
}
