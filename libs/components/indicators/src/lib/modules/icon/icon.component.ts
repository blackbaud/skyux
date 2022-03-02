import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyIconType } from './types/icon-type';
import { SkyIconVariantType } from './types/icon-variant-type';

@Component({
  selector: 'sky-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyIconComponent {
  /**
   * Specifies the name of
   * [the Font Awesome 4.7 icon](https://fontawesome.com/v4.7/icons/) to
   * display. Do not specify the `fa fa-` classes.
   * @required
   */
  @Input()
  public icon: string;

  /**
   * Specifies the type of icon to display. Specifying `"fa"` will display a Font Awesome icon,
   * while specifying `"skyux"` will display an icon from the custom SKY UX icon font. Note that
   * the custom SKY UX icon font is currently in beta.
   * @default "fa"
   */
  @Input()
  public iconType: SkyIconType = 'fa';

  /**
   * Specifies the size of the icon using
   * [Font Awesome sizes](https://fontawesome.com/how-to-use/on-the-web/styling/sizing-icons).
   */
  @Input()
  public size: string;

  /**
   * Indicates whether the icon has a fixed width.
   */
  @Input()
  public fixedWidth: boolean;

  /**
   * Specifies the icon variant (`"line"` or `"solid"`). If the variant doesn't exist for the
   * specified icon, the normal icon is displayed.
   */
  @Input()
  public variant: SkyIconVariantType;
}
