import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { SkyIconType } from './types/icon-type';
import { SkyIconVariantType } from './types/icon-variant-type';

@Component({
  selector: 'sky-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
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
   * The name of the Blackbaud SVG icon to display. For internal use only.
   * @internal
   */
  @Input()
  public iconName: string | undefined;

  /**
   * The type of icon to display. Specifying `"fa"` displays a Font Awesome icon,
   * while specifying `"skyux"` displays an icon from the custom SKY UX icon font. Note that
   * the custom SKY UX icon font is currently in beta.
   * @default "fa"
   * @deprecated The icon component now automatically infers which type of icon to use based on the current theme. This input will be removed in a future version.
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
   * Whether to enforce a fixed width based on icon size. By default, icons of a specified size share a
   * consistent height, but their widths vary and can throw off vertical alignment. Use a fixed width when
   * you stack icons vertically, such as in lists.
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

  protected themeSvc = inject(SkyThemeService, { optional: true });
}
