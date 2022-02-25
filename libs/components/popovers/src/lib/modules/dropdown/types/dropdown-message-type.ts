export enum SkyDropdownMessageType {
  /**
   * Opens the dropdown menu.
   */
  Open = 0,

  /**
   *  Closes the dropdown menu.
   */
  Close = 1,

  /**
   * Puts focus on the dropdown button.
   */
  FocusTriggerButton = 2,

  /**
   * Puts focus on the next item in the dropdown menu.
   */
  FocusNextItem = 3,

  /**
   * Puts focus on the previous item in the dropdown menu.
   */
  FocusPreviousItem = 4,

  /**
   * Repositions the dropdown menu next to the dropdown button. This is useful for when the
   * dropdown menu's width and height change while it is open.
   */
  Reposition = 5,

  /**
   * Puts focus on the first item in the dropdown menu.
   */
  FocusFirstItem = 6,

  /**
   * Puts focus on the last item in the dropdown menu.
   */
  FocusLastItem = 7,
}
