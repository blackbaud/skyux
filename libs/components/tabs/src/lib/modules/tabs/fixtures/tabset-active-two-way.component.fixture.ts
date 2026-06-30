import { Component, model } from '@angular/core';

import { SkyTabIndex } from '../tab-index';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tabset-active-two-way.component.fixture.html',
  standalone: false,
})
export class TabsetActiveTwoWayBindingTestComponent {
  public activeTab = model<string>('1');

  public onActiveChange(tabIndex: SkyTabIndex): void {
    this.activeTab.set(tabIndex as string);
  }
}
