import {
  Component
} from '@angular/core';

import {
  SkyIconVariant
} from '../icon-variant';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon.component.fixture.html'
})
export class IconTestComponent {
  public icon = 'circle';
  public iconType: 'fa' | 'skyux';
  public size = '3x';
  public fixedWidth = false;
  public variant: SkyIconVariant;
}
