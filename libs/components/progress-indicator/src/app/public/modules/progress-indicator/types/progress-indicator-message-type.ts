export enum SkyProgressIndicatorMessageType {

  /**
   * Indicates that the current step is complete.
   * This completes the active item and moves to the next item.
   */
  Progress = 0,

  /**
   * Indicates that progress should return to the previous step.
   * This moves from the active item to the item that precedes it.
   */
  Regress = 1,

  /**
   * Indicates that progress is incomplete.
   * This marks all items as incomplete and sets the first item as the active item.
   */
  Reset = 2,

  /**
   * Indicates that progress is complete.
   * This marks all items as complete and sets the last item as the active item.
   */
  Finish = 3,

  /**
   * Indicates that progress should move to the item indicated by the `data.activeIndex` property.
   */
  GoTo = 4
}
