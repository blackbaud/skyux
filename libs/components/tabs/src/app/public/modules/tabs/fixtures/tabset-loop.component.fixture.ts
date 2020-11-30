import {
  Component
} from '@angular/core';

import {
  SkyTabsetTabIndexesChange
} from '../tabset-tab-indexes-change';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tabset-loop.component.fixture.html'
})
export class TabsetLoopTestComponent {

  public activeIndex = 0;

  public tabArray: any[] = [];

  constructor() {
    this.tabArray = this.createTabArray();
  }

  public onTabIndexesChange(change: SkyTabsetTabIndexesChange): void {}

  public createTabArray(): any[] {
    return [
      {
        tabHeading: 'Tab 1',
        tabContent: 'A list containing 25012 items',
        tabIndex: 0
      },
      {
        tabHeading: 'Tab 2',
        tabContent: 'A list containing 280 items',
        tabIndex: 1
      }
    ];
  }

  public addTabAndActivate(): void {
    this.tabArray.push({
      tabHeading: 'Tab 3',
      tabContent: 'This tab doesn\'t have a list of items',
      tabIndex: 2
    });
    // Important: activate the tab immediately after being added to the array.
    this.activeIndex = 2;
  }
}
