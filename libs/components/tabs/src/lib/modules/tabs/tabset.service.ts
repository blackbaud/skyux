import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { SkyTabIndex } from './tab-index';

import { SkyTabsetActiveTabUnregisteredArgs } from './tabset-active-tab-unregistered-args';

/**
 * @internal
 */
@Injectable()
export class SkyTabsetService {
  public get activeTabUnregistered(): Observable<SkyTabsetActiveTabUnregisteredArgs> {
    return this._activeTabUnregistered.asObservable();
  }

  public get activeTabIndex(): Observable<SkyTabIndex> {
    return this._activeTabIndex.asObservable();
  }

  public currentActiveTabIndex: SkyTabIndex = 0;

  private _activeTabIndex = new BehaviorSubject<SkyTabIndex>(0);

  private _activeTabUnregistered =
    new Subject<SkyTabsetActiveTabUnregisteredArgs>();

  private tabs: {
    tabIndex: SkyTabIndex;
  }[] = [];

  private tabCounter = 0;

  /**
   * Sets the active tab by its unique `tabIndex` property.
   */
  public setActiveTabIndex(
    value: SkyTabIndex,
    config = {
      emitChange: true,
    }
  ): void {
    if (
      value !== undefined &&
      !this.tabIndexesEqual(value, this.currentActiveTabIndex)
    ) {
      this.currentActiveTabIndex = value;
      /* istanbul ignore else */
      if (config.emitChange) {
        this._activeTabIndex.next(value);
      }
    }
  }

  /**
   * Registers a tab component.
   */
  public registerTab(tabIndex?: SkyTabIndex): SkyTabIndex {
    if (tabIndex === undefined) {
      tabIndex = this.tabCounter;
      this.tabCounter++;
    }

    this.tabs.push({ tabIndex });

    return tabIndex;
  }

  public updateTabIndex(
    currentTabIndex: SkyTabIndex,
    newTabIndex: SkyTabIndex
  ): void {
    const found = this.tabs.find((tab) =>
      this.tabIndexesEqual(tab.tabIndex, currentTabIndex)
    );
    found.tabIndex = newTabIndex;
  }

  /**
   * Unregisters a tab component.
   */
  public unregisterTab(tabIndex: SkyTabIndex): void {
    const index = this.tabs.findIndex((tab) =>
      this.tabIndexesEqual(tab.tabIndex, tabIndex)
    );

    // Notify the tabset component when an active tab is unregistered.
    if (this.isTabIndexActive(this.tabs[index].tabIndex)) {
      this._activeTabUnregistered.next({
        arrayIndex: index,
      });
    }

    this.tabs.splice(index, 1);
  }

  /**
   * Unregisters all tab components at once.
   */
  public unregisterAll(): void {
    this.tabs = [];
  }

  /**
   * Compares two tab indexes and returns `true` if they are equal.
   */
  public tabIndexesEqual(
    tabIndex1: SkyTabIndex,
    tabIndex2: SkyTabIndex
  ): boolean {
    return tabIndex1 === tabIndex2 || +tabIndex1 === +tabIndex2;
  }

  /**
   * Verifies if a provided tab index is registered.
   */
  public isValidTabIndex(tabIndex: SkyTabIndex): boolean {
    return this.tabs.some((tab) =>
      this.tabIndexesEqual(tab.tabIndex, tabIndex)
    );
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
  public activateNearestTab(arrayIndex: number): void {
    const newActiveTab = this.tabs[arrayIndex] || this.tabs[arrayIndex - 1];
    if (newActiveTab) {
      this.currentActiveTabIndex = newActiveTab.tabIndex;
    }
  }

  private isTabIndexActive(tabIndex: SkyTabIndex): boolean {
    return this.tabIndexesEqual(tabIndex, this.currentActiveTabIndex);
  }
}
