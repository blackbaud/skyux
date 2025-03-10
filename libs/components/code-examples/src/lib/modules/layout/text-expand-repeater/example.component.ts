import { Component } from '@angular/core';
import { SkyTextExpandRepeaterModule } from '@skyux/layout';

/**
 * @title Text expand repeater with basic setup
 */
@Component({
  selector: 'app-layout-text-expand-repeater-example',
  templateUrl: './example.component.html',
  imports: [SkyTextExpandRepeaterModule],
})
export class LayoutTextExpandRepeaterExampleComponent {
  protected repeaterData: string[] = [
    'Repeater item 1',
    'Repeater item 2',
    'Repeater item 3',
    'Repeater item 4',
    'Repeater item 5',
  ];
}
