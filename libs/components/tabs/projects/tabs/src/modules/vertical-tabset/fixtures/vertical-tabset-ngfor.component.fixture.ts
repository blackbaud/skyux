import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-ngfor-cmp',
  templateUrl: './vertical-tabset-ngfor.component.fixture.html',
})
export class VerticalTabsetWithNgForTestComponent {
  public activeIndex: number;
  public maintainTabContent: boolean = false;

  public tabs = [
    {
      id: '1',
      heading: 'tab 1',
      content: 'Tab 1 content',
    },
    {
      id: '2',
      heading: 'tab 2',
      content: 'Tab 2 content',
    },
    {
      id: '3',
      heading: 'tab 3',
      content: 'Tab 3 content',
    },
  ];

  public onActiveChange(event: number): void {
    this.activeIndex = event;
  }
}
