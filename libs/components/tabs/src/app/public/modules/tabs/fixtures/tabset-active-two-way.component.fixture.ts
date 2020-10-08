import {
  Component
} from '@angular/core';

import {
  SkyTabIndex
} from '../tab-index';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tabset-active-two-way.component.fixture.html'
})
export class TabsetActiveTwoWayBindingTestComponent {

  public activeTab: string = '1';

  public onActiveChange(tabIndex: SkyTabIndex): void { }

}
