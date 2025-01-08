import { Component } from '@angular/core';
import { SkyTextExpandRepeaterModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyTextExpandRepeaterModule],
})
export class DemoComponent {
  protected repeaterData: string[] = [
    'Repeater item 1',
    'Repeater item 2',
    'Repeater item 3',
    'Repeater item 4',
    'Repeater item 5',
  ];
}
