import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-demo',
  templateUrl: './tabs-demo.component.html',
})
export class TabsDemoComponent {
  public tabArray = [
    {
      tabHeading: 'Tab 1',
      tabContent: 'A list containing 25012 items',
      tabHeaderCount: 25012,
    },
    {
      tabHeading: 'Tab 2',
      tabContent: 'A list containing 280 items',
      tabHeaderCount: 280,
    },
    {
      tabHeading: 'Tab 3',
      tabContent: "This tab doesn't have a list of items",
    },
  ];
}
