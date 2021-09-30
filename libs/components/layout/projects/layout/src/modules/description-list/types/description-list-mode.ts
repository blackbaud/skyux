/**
 * @deprecated Use `SkyDescriptionListModeType` instead.
 * @internal
 * Specifies how to display the term-description pairs within a description list.
 */
export enum SkyDescriptionListMode {

  /**
   * Displays term-description pairs side by side in a horizontal list.
   * This mode provides a responsive layout.
   */
  horizontal = 'horizontal',

  /**
   * Displays terms and descriptions side by side with the term on the left and the description
   * on the right. This mode includes room for long descriptions and uses a responsive layout
   * that stacks term-description pairs vertically.
   */
  longDescription = 'longDescription',

  /**
   * Displays term-description pairs in a vertical list.
   */
  vertical = 'vertical'

}
