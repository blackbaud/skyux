import { Component, input } from '@angular/core';
import {
  SkyTextExpandRepeaterListStyleType,
  SkyTextExpandRepeaterModule,
} from '@skyux/layout';

@Component({
  selector: 'sky-text-expand-repeater-fixture',
  templateUrl: './text-expand-repeater-harness-test.component.html',
  imports: [SkyTextExpandRepeaterModule],
})
export class TextExpandRepeaterHarnessTestComponent {
  public style = input<SkyTextExpandRepeaterListStyleType>('ordered');
  public maxItems = input<number>(2);

  protected repeaterData: string[] = [
    'Repeater item 1',
    'Repeater item 2',
    'Repeater item 3',
    'Repeater item 4',
    'Repeater item 5',
  ];
}
