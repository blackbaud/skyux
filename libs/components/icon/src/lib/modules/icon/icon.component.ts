import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  input,
} from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { SkyIconSize } from './types/icon-size';
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
   * @deprecated Font Awesome support will be removed in SKY UX 13. Use iconName instead.
   */
  @Input()
  public icon: string | undefined;

  /**
   * The name of the Blackbaud SVG icon to display.
   */
  @Input()
  public iconName: string | undefined;

  /**
   * The type of icon to display. Specifying `"fa"` displays a Font Awesome icon,
   * while specifying `"skyux"` displays an icon from the custom SKY UX icon font. Note that
   * the custom SKY UX icon font is currently in beta.
   * @default "fa"
   * @deprecated The icon component now automatically infers which type of icon to use based on the current theme. This input will be removed in SKY UX 13.
   */
  @Input()
  public iconType: SkyIconType | undefined;

  /**
   * The size of the icon using
   * [Font Awesome sizes](https://fontawesome.com/v4/examples/). Size is relative to the font size. Do not prefix the size with `fa-`.
   * @deprecated `size` is deprecated and will be removed in SKY UX 13. Use `iconSize` to set a specific size that does not scale with font size instead.
   */
  @Input()
  public size: string | undefined;

  /**
   * Whether to enforce a fixed width based on icon size. By default, icons of a specified size share a
   * consistent height, but their widths vary and can throw off vertical alignment. Use a fixed width when
   * you stack icons vertically, such as in lists.
   * @default false
   * @deprecated `fixedWidth` is a Font Awesome input and will be removed when Font Awesome support is dropped in SKY UX 13.
   * All icons using iconName are automatically fixed width.
   */
  @Input()
  public fixedWidth: boolean | undefined;

  /**
   * The icon variant. If the variant doesn't exist for the
   * specified icon, the normal icon is displayed. This property only applies when using SKY UX icons.
   */
  @Input()
  public variant: SkyIconVariantType | undefined;

  /**
   * The icon size. Size is independent of font size.
   * @default "m"
   */
  public readonly iconSize = input<SkyIconSize | undefined>();

  protected themeSvc = inject(SkyThemeService, { optional: true });
}
