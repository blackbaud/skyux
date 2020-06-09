export interface SkyIconStackItem {

  /**
   * Specifies the name of
   * [the Font Awesome icon](https://developer.blackbaud.com/design/styles/icons) to
   * display. Do not specify the `fa fa-` classes.
   * @required
   */
  icon: string;

  /**
   * Specifies the type of icon to display. Specifying `fa` will display a Font Awesome icon,
   * while specifying `skyux` will display an icon from the custom SKY UX icon font. Note that
   * the custom SKY UX icon font is currently in beta.
   */
  iconType?: string;
}
