import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TabButtonViewModel } from './tab-button-view-model';
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

  public get focusedTabBtnIndex(): Observable<SkyTabIndex> {
    return this._focusedTabBtnIndex.asObservable();
  }

  public currentActiveTabIndex: SkyTabIndex = 0;

  public currentFocusedTabBtnIndex: SkyTabIndex = 0;

  private _activeTabIndex = new BehaviorSubject<SkyTabIndex>(0);

  private _focusedTabBtnIndex = new Subject<SkyTabIndex>();

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

      this.setFocusedTabBtnIndex(value);
    }
  }

  public focusNextTabBtn(tabButtons: TabButtonViewModel[]): void {
    const currentTabArrayIndex = this.tabs.findIndex((tab) =>
      this.tabIndexesEqual(tab.tabIndex, this.currentFocusedTabBtnIndex)
    );

    for (
      let i = this.getNextTabArrayIndex(currentTabArrayIndex);
      i !== currentTabArrayIndex;
      i = this.getNextTabArrayIndex(i)
    ) {
      const tabBtn = tabButtons[i];
      if (!tabBtn.disabled) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public focusPrevTabBtn(tabButtons: TabButtonViewModel[]): void {
    const currentTabArrayIndex = this.tabs.findIndex((tab) =>
      this.tabIndexesEqual(tab.tabIndex, this.currentFocusedTabBtnIndex)
    );

    for (
      let i = this.getPrevTabArrayIndex(currentTabArrayIndex);
      i !== currentTabArrayIndex;
      i = this.getPrevTabArrayIndex(i)
    ) {
      const tabBtn = tabButtons[i];
      if (!tabBtn.disabled) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public focusFirstOrNearestTabBtn(tabButtons: TabButtonViewModel[]): void {
    for (let i = 0; i < tabButtons.length; i++) {
      const tabBtn = tabButtons[i];

      if (!tabBtn.disabled) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public focusLastOrNearestTabBtn(tabButtons: TabButtonViewModel[]): void {
    for (let i = tabButtons.length - 1; i >= 0; i--) {
      const tabBtn = tabButtons[i];

      if (!tabBtn.disabled) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public setFocusedTabBtnIndex(tabIndex: SkyTabIndex): void {
    this.currentFocusedTabBtnIndex = tabIndex;
    this._focusedTabBtnIndex.next(tabIndex);
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
    if (this.isTabIndexActive(this.tabs[index]?.tabIndex)) {
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

  private getNextTabArrayIndex(currentIndex: number): number {
    let nextIndex = currentIndex + 1;

    if (nextIndex === this.tabs.length) {
      nextIndex = 0;
    }

    return nextIndex;
  }

  private getPrevTabArrayIndex(currentIndex: number): number {
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = this.tabs.length - 1;
    }

    return prevIndex;
  }
}
