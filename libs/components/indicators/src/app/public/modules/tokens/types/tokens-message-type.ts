export enum SkyTokensMessageType {

  /**
   * Places focus on the last token in the list.
   */
  FocusLastToken = 0,

  /**
   * Places focus on the token that is currently selected.
   */
  FocusActiveToken = 1,

  /**
   * Places focus on the token before the currently selected token.
   */
  FocusPreviousToken = 2,

  /**
   * Places focus on the token after the currently selected token.
   */
  FocusNextToken = 3,

  /**
   * Removes the token that is currently selected from the list of tokens.
   */
  RemoveActiveToken = 4

}
