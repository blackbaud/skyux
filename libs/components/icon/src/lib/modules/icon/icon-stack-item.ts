import { SkyIconType } from './types/icon-type';

/**
 * @internal
 */
export interface SkyIconStackItem {
  /**
   * The name of
   * [the Font Awesome 4.7 icon](https://fontawesome.com/v4.7/icons/) to
   * display. Do not specify the `fa fa-` classes.
   * @required
   */
  icon: string;

  /**
   * The type of icon to display. Specifying `fa` displays a Font Awesome icon,
   * while specifying `skyux` displays an icon from the custom SKY UX icon font. Note that
   * the custom SKY UX icon font is currently in beta.
   * @deprecated
   */
  iconType?: SkyIconType;
}
