import { Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyTabsModule],
})
export class DemoComponent {
  protected tabArray = [
    {
      tabHeading: 'Tab 1',
      tabContent: 'A list containing 25012 items',
    },
    {
      tabHeading: 'Tab 2',
      tabContent: 'A list containing 280 items',
    },
    {
      tabHeading: 'Tab 3',
      tabContent: "This tab doesn't have a list of items",
    },
  ];
}
