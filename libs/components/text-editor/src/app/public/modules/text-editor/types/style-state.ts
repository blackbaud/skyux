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
   * Specifies the font family. Available values: `"Blackbaud Sans"`, `"Helvetica Neue"`,
   * `"Arial"`, `"sans-serif"`, `"Arial Black"`, `"Courier New"`, and `"Times New Roman"`.
   */
  font: string;

  /**
   * Indicates whether to make text bold.
   */
  boldState: boolean;

  /**
   * Indicates whether to italicize text.
   */
  italicState: boolean;

  /**
   * Indicates whether to underline text.
   */
  underlineState: boolean;

  /**
   * Indicates whether to format text as a link.
   */
  linkState: boolean;
}
