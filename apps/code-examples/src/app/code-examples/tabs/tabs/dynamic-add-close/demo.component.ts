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
      tabContent: 'Content for Tab 1',
    },
    {
      tabHeading: 'Tab 2',
      tabContent: 'Content for Tab 2',
    },
    {
      tabHeading: 'Tab 3',
      tabContent: 'Content for Tab 3',
    },
  ];

  #tabCounter = 3;

  protected onNewTabClick(): void {
    this.#tabCounter++;

    this.tabArray.push({
      tabHeading: 'Tab ' + this.#tabCounter,
      tabContent: 'Content for Tab' + this.#tabCounter,
    });
  }

  protected onCloseClick(arrayIndex: number): void {
    this.tabArray.splice(arrayIndex, 1);
  }
}
