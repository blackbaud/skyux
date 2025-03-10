import { Component } from '@angular/core';

import { SkyIconSize } from '../types/icon-size';
import { SkyIconVariantType } from '../types/icon-variant-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon.component.fixture.html',
  standalone: false,
})
export class IconTestComponent {
  public icon = 'circle';
  public iconName: string | undefined;
  public iconType: 'fa' | 'skyux' | undefined;
  public size: string | undefined = '3x';
  public iconSize: SkyIconSize | undefined;
  public fixedWidth: boolean | undefined = false;
  public variant: SkyIconVariantType | undefined;
}
