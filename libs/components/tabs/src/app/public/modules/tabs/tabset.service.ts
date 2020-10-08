import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  SkyTabIndex
} from './tab-index';

/**
 * @internal
 */
@Injectable()
export class SkyTabsetService {

  public get activeTabIndex(): Observable<SkyTabIndex> {
    return this._activeTabIndex.asObservable();
  }

  public currentActiveTabIndex: SkyTabIndex = 0;

  private _activeTabIndex = new BehaviorSubject<SkyTabIndex>(0);

  private tabs: {
    tabIndex: SkyTabIndex;
  }[] = [];

  private tabCounter = 0;

  /**
   * Sets the active tab by its unique `tabIndex` property.
   */
  public setActiveTabIndex(value: SkyTabIndex, config = {
    emitChange: true
  }): void {
    if (
      value !== undefined &&
      !this.tabIndexesEqual(value, this.currentActiveTabIndex)
    ) {
      this.currentActiveTabIndex = value;
      if (config.emitChange) {
        this._activeTabIndex.next(value);
      }
    }
  }

  /**
   * Registers a tab component.
   */
  public registerTab(tabIndex?: SkyTabIndex): SkyTabIndex {
    const nextIndex = this.tabCounter;

    const newTabIndex = (tabIndex !== undefined) ? tabIndex : nextIndex;

    this.tabs.push({
      tabIndex: newTabIndex
    });

    this.tabCounter++;

    return newTabIndex;
  }

  /**
   * Unregisters a tab component.
   */
  public unregisterTab(tabIndex: SkyTabIndex): void {
    this.tabCounter--;

    const index = this.tabs.findIndex(tab => this.tabIndexesEqual(tab.tabIndex, tabIndex));

    // If the currently active tab is getting unregistered, activate the next one.
    if (this.isTabIndexActive(this.tabs[index].tabIndex)) {
      this.activateNearestTab(index);
    }

    this.tabs.splice(index, 1);
  }

  /**
   * Unregisters all tab components at once.
   */
  public unregisterAll(): void {
    this.tabCounter = 0;
    this.tabs = [];
  }

  /**
   * Compares two tab indexes and returns `true` if they are equal.
   */
  public tabIndexesEqual(tabIndex1: SkyTabIndex, tabIndex2: SkyTabIndex): boolean {
    return (
      tabIndex1 === tabIndex2 ||
      +tabIndex1 === +tabIndex2
    );
  }

  /**
   * Verifies if a provided tab index is registered.
   */
  public isValidTabIndex(tabIndex: SkyTabIndex): boolean {
    return this.tabs.some(tab => this.tabIndexesEqual(tab.tabIndex, tabIndex));
  }

  /**
   * Activates the first registered tab.
   */
  public activateFirstTab(): SkyTabIndex | undefined {
    const firstTabIndex = this.tabs[0] && this.tabs[0].tabIndex;
    if (firstTabIndex !== undefined) {
      this.setActiveTabIndex(firstTabIndex);
      return firstTabIndex;
    }
  }

  /**
   * Activates the next registered tab, or the previous one based on a provided array index.
   */
  private activateNearestTab(arrayIndex: number): void {
    const newActiveTab = this.tabs[arrayIndex + 1] || this.tabs[arrayIndex - 1];
    if (newActiveTab) {
      // Wait for tabset UI changes to render before activating.
      setTimeout(() => {
        this._activeTabIndex.next(newActiveTab.tabIndex);
      });
    }
  }

  private isTabIndexActive(tabIndex: SkyTabIndex): boolean {
    return this.tabIndexesEqual(tabIndex, this.currentActiveTabIndex);
  }
}
