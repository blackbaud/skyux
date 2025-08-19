import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from '@angular/core';

import { SkyIconSize } from './types/icon-size';
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
   * The name of the Blackbaud SVG icon to display.
   */
  @Input({ required: true })
  public iconName!: string;

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
}
