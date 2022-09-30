import { Component, Input } from '@angular/core';

import { SkyKeyInfoLayoutType } from './key-info-layout-type';

@Component({
  selector: 'sky-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
})
export class SkyKeyInfoComponent {
  /**
   * Specifies whether to display key info in a vertical layout with the label under the
   * value or in a horizontal layout with the label beside the value.
   * @default "vertical"
   */
  // TODO: More strongly type this in a future breaking change.
  @Input()
  public layout: SkyKeyInfoLayoutType | undefined = 'vertical';
}
