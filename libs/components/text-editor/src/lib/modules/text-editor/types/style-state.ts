export interface SkyTextEditorStyleState {
  /**
   * The background color. Accepts any CSS color value.
   */
  backColor: string;

  /**
   * The font color. Accepts any CSS color value.
   */
  fontColor: string;

  /**
   * The font size in pixels.
   */
  fontSize: number;

  /**
   * The font family. Available values: `"Blackbaud Sans"`,
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
