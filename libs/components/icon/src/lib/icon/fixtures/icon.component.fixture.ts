import { Component } from '@angular/core';

import { SkyIconVariantType } from '../types/icon-variant-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon.component.fixture.html',
})
export class IconTestComponent {
  public icon = 'circle';
  public iconName: string | undefined;
  public iconType: 'fa' | 'skyux' | undefined;
  public size: string | undefined = '3x';
  public fixedWidth: boolean | undefined = false;
  public variant: SkyIconVariantType | undefined;
}
