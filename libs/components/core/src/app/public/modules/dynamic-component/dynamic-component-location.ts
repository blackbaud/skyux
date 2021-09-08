/**
 * The location on the page where the dynamic component should be rendered.
 */
export enum SkyDynamicComponentLocation {

  /**
   * Renders the dynamic component before a given element.
   */
  BeforeElement,

  /**
   * Renders the dynamic component as the last element inside the BODY element.
   */
  BodyBottom,

  /**
   * Renders the dynamic component as the first element inside the BODY element.
   */
  BodyTop,

  /**
   * Renders the dynamic component as the last element inside a given element.
   */
  ElementBottom,

  /**
   * Renders the dynamic component as the first element inside a given element.
   */
  ElementTop

}
