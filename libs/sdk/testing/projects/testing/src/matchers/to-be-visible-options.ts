/**
 * Represents options for the `toBeVisible` Jasmine matcher.
 */
export interface SkyToBeVisibleOptions {
  /**
   * Indicates if the CSS `display` property should be considered when checking an element's
   * visibility. If the `display` property is set to "none", the element is not considered visible.
   */
  checkCssDisplay?: boolean;

  /**
   * Indicates if the CSS `visibility` property should be considered when checking an element's
   * visibility. If the `visibility` property is set to "hidden", the element is not considered
   * visible.
   */
  checkCssVisibility?: boolean;

  /**
   * Indicates if the element's height and width should be considered when checking an element's
   * visibility. If the element has a height and width greater than zero, the element is considered
   * visible.
   */
  checkDimensions?: boolean;

  /**
   * Indicates if the element's existence on the document should be considered when checking an
   * element's visibility. If the element exists, it is considered visible.
   */
  checkExists?: boolean;
}
