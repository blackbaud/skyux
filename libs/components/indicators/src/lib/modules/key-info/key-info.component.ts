import { Component, Input } from '@angular/core';

import { SkyKeyInfoLayoutType } from './key-info-layout-type';

@Component({
  selector: 'sky-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
})
export class SkyKeyInfoComponent {
  /**
   * The layout for the key info. The vertical layout places the label under the
   * value, while the horizontal layout places the label beside the value.
   * @default "vertical"
   */
  @Input()
  public layout: SkyKeyInfoLayoutType | undefined = 'vertical';
}
