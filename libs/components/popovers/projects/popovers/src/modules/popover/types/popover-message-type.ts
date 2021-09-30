/**
 * Specifies the type of message to send to the popover component.
 */
export enum SkyPopoverMessageType {

  /**
   * Opens the popover.
   */
  Open = 0,

  /**
   * Closes the popover.
   */
  Close = 1,

  /**
   * Repositions the popover to the appropriate position.
   * This is useful for when the popover's width and height change while it is open.
   */
  Reposition = 2,

  /**
   * Brings focus to the popover element.
   */
  Focus = 3
}
