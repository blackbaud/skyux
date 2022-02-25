/**
 * Options for creating a viewkeeper instance.
 */
export interface SkyViewkeeperOptions {
  /**
   * The element that defines the bounds in which to keep the element in view. When the
   * boundary element is scrolled out of view, the viewkeeper element will be scrolled
   * out of view.
   */
  boundaryEl?: HTMLElement;

  /**
   * The element to keep in view.
   */
  el?: HTMLElement;

  /**
   * Specifies a scrollable parent which the viewkeeper resides in and should listen to and be
   * positioned within.
   */
  scrollableHost?: HTMLElement;

  /**
   * Specifies whether to set the width of the viewkeeper element to the width of its
   * host element. Otherwise, if the element does not have an explicit width specified,
   * the element would collapse horizontally as a result of fixing the element to the top
   * of the viewport.
   */
  setWidth?: boolean;

  /**
   * Reserved space in pixels above the viewkeeper element.
   */
  verticalOffset?: number;

  /**
   * The element under which the viewkeeper element should be fixed. Typically this is
   * another viewkeeper element that is above the current viewkeeper element in the same
   * boundary element.
   */
  verticalOffsetEl?: HTMLElement;

  /**
   * Reserved space in pixels at the top of the viewport.
   */
  viewportMarginTop?: number;
}
