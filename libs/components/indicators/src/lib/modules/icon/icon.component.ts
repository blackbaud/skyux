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
   * The name of
   * [the Font Awesome 4.7 icon](https://fontawesome.com/v4.7/icons/) or the SKY UX icon to
   * display. When specifying a Font Awesome icon, do not prefix the name with `fa-`.
   * @required
   */
  @Input()
  public icon: string | undefined;

  /**
   * The type of icon to display. Specifying `"fa"` displays a Font Awesome icon,
   * while specifying `"skyux"` displays an icon from the custom SKY UX icon font. Note that
   * the custom SKY UX icon font is currently in beta.
   * @default "fa"
   */
  @Input()
  public iconType: SkyIconType | undefined;

  /**
   * The size of the icon using
   * [Font Awesome sizes](https://fontawesome.com/v4/examples/). Do not prefix the size with `fa-`.
   */
  @Input()
  public size: string | undefined;

  /**
   * Whether the icon has a fixed width.
   * @default false
   */
  @Input()
  public fixedWidth: boolean | undefined;

  /**
   * The icon variant. If the variant doesn't exist for the
   * specified icon, the normal icon is displayed. This property only applies when using SKY UX icons.
   */
  @Input()
  public variant: SkyIconVariantType | undefined;
}
