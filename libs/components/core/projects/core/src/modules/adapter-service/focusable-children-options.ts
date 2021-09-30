
/**
 * Options for getting focusable children.
 */
export interface SkyFocusableChildrenOptions {

  /**
   * By default, the `getFocusableChildren()` function will filter out elements with
   * a `tabIndex` of `-1`. Setting `ignoreTabIndex = true` will ignore this filter.
   */
  ignoreTabIndex?: boolean;

  /**
   * By default, the `getFocusableChildren()` function will only return visible elements.
   * Setting `ignoreVisibility = true` will ignore this filter.
   */
  ignoreVisibility?: boolean;
}
