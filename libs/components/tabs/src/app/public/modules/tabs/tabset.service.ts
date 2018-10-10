import { Injectable } from '@angular/core';

import { SkyTabComponent } from './tab.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

@Injectable()
export class SkyTabsetService {

  public tabs: BehaviorSubject<Array<SkyTabComponent>>
    = new BehaviorSubject<Array<SkyTabComponent>>([]);

  public activeIndex: BehaviorSubject<any> = new BehaviorSubject(0);

  public activateTab(tab: SkyTabComponent) {
    this.tabs.take(1).subscribe((currentTabs) => {
      this.activeIndex.next(tab.tabIndex);
    });
  }

  public activateTabIndex(tabIndex: string | number) {

    this.tabs.take(1).subscribe((currentTabs) => {
      let newSelectedTab = this.getTabFromIndex(tabIndex, currentTabs);

      if (newSelectedTab) {
        this.activeIndex.next(newSelectedTab.tabIndex);
      } else {
        this.activeIndex.next(tabIndex);
      }
    });
  }

  public addTab(tab: SkyTabComponent) {

    this.tabs.take(1).subscribe((currentTabs) => {
      if (tab.tabIndex === undefined) {
        tab.tabIndex = 0;
        let lastTabIndex = this.getLastTabIndex(currentTabs);
        if (currentTabs && (lastTabIndex || lastTabIndex === 0)) {
          tab.tabIndex = lastTabIndex + 1;
        }
      }
      currentTabs.push(tab);
      this.tabs.next(currentTabs);
    });
  }

  public destroyTab(tab: SkyTabComponent) {

    this.tabs.take(1).subscribe((currentTabs) => {

      let tabIndex = currentTabs.indexOf(tab);
      if (tab.active) {
        // Try selecting the next tab first, and if there's no next tab then
        // try selecting the previous one.
        let newActiveTab = currentTabs[tabIndex + 1] || currentTabs[tabIndex - 1];

        /*istanbul ignore else */
        if (newActiveTab) {
          this.activeIndex.next(newActiveTab.tabIndex);
        }
      }

      if (tabIndex > -1) {
        currentTabs.splice(tabIndex, 1);
      }
      this.tabs.next(currentTabs);
    });

  }

  public destroy() {
    this.tabs.complete();
    this.activeIndex.complete();
  }

  private getLastTabIndex(tabs: Array<SkyTabComponent>) {
    let result: any = undefined;
    for (let i = 0; i < tabs.length; i++) {
      if (typeof tabs[i].tabIndex === 'number' &&
        (result === undefined || result < tabs[i].tabIndex)) {
        result = tabs[i].tabIndex;
      }
    }
    return result;
  }

  private getTabFromIndex(index: string | number, currentTabs: Array<SkyTabComponent>) {
    for (let i = 0, n = currentTabs.length; i < n; i++) {
      let existingTab = currentTabs[i];

      if (existingTab.tabIndex === index || existingTab.tabIndex.toString() === index) {
        return existingTab;
      }
    }

    return undefined;
  }
}
