import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
})
export class SkyKeyInfoComponent {
  /**
   * Specifies whether to display key info in a `vertical` layout with the label under the
   * value or in a `horizontal` layout with the label beside the value.
   * @default "vertical"
   */
  @Input()
  public layout = 'vertical';
}
