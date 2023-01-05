export enum SkyProgressIndicatorMessageType {
  /**
   * The current step is complete.
   * This completes the active item and moves to the next item.
   */
  Progress = 0,

  /**
   * Progress should return to the previous step.
   * This moves from the active item to the item that precedes it.
   */
  Regress = 1,

  /**
   * Progress is incomplete.
   * This marks all items as incomplete and sets the first item as the active item.
   */
  Reset = 2,

  /**
   * Progress is complete.
   * This marks all items as complete and sets the last item as the active item.
   */
  Finish = 3,

  /**
   * Progress should move to the item indicated by the `data.activeIndex` property.
   */
  GoTo = 4,
}
