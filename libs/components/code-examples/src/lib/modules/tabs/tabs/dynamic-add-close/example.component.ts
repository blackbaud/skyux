import { Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

/**
 * @title Tabs bound to an array, with add and close buttons
 */
@Component({
  selector: 'app-tabs-dynamic-add-close-example',
  templateUrl: './example.component.html',
  imports: [SkyTabsModule],
})
export class TabsDynamicAddCloseExampleComponent {
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
