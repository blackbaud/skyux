import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyIconSize } from '../types/icon-size';
import { SkyIconVariantType } from '../types/icon-variant-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IconTestComponent {
  public iconName = 'test';
  public iconSize: SkyIconSize | undefined;
  public variant: SkyIconVariantType | undefined;
}
