import { Component } from '@angular/core';

import { SkyIconVariantType } from '../types/icon-variant-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon.component.fixture.html',
})
export class IconTestComponent {
  public icon = 'circle';
  public iconType: 'fa' | 'skyux';
  public size = '3x';
  public fixedWidth = false;
  public variant: SkyIconVariantType;
}
