import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList
} from '@angular/core';

import { SkyTabComponent } from './tab.component';

@Component({
  selector: 'sky-tab-dropdown',
  templateUrl: './tab-dropdown.component.html',
  styleUrls: ['./tab-dropdown.component.scss']
})
export class SkyTabDropdownComponent {
  @Input()
  public tabs: QueryList<SkyTabComponent>;

  @Output()
  public tabClick = new EventEmitter<SkyTabComponent>();

  @Output()
  public closeClick = new EventEmitter<SkyTabComponent>();

  public get activeTabHeading(): string {
    let activeTab = this.tabs.filter((item) => {
      return item.active;
    });

    /*istanbul ignore else */
    if (activeTab.length > 0) {
      return activeTab[0].tabHeading;
    }
    /* istanbul ignore next */
    /* sanity check */
    return '';
  }

  public selectTab(tab: SkyTabComponent) {
    if (!tab.disabled) {
      this.tabClick.emit(tab);
    }
  }

  public closeTab(tab: SkyTabComponent) {
    this.closeClick.emit(tab);
  }
}
