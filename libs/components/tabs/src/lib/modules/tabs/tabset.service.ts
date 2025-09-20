import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TabButtonViewModel } from './tab-button-view-model';
import { SkyTabIndex } from './tab-index';
import { SkyTabLayoutType } from './tab-layout-type';
import { SkyTabsetActiveTabChangeArgs } from './tabset-active-tab-change-args';
import { SkyTabsetActiveTabUnregisteredArgs } from './tabset-active-tab-unregistered-args';

/**
 * @internal
 */
@Injectable()
export class SkyTabsetService implements OnDestroy {
  public readonly activeTabUnregistered: Observable<SkyTabsetActiveTabUnregisteredArgs>;

  public readonly activeTabChange: Observable<SkyTabsetActiveTabChangeArgs>;

  public readonly focusedTabBtnIndex: Observable<SkyTabIndex>;

  public readonly activeTabLayout: Observable<SkyTabLayoutType>;

  public currentActiveTabIndex: SkyTabIndex | undefined = 0;

  public currentFocusedTabBtnIndex: SkyTabIndex = 0;

  #activeTabChange: BehaviorSubject<SkyTabsetActiveTabChangeArgs>;

  #focusedTabBtnIndex: Subject<SkyTabIndex>;

  #activeTabUnregistered: Subject<SkyTabsetActiveTabUnregisteredArgs>;

  #activeTabLayout: Subject<SkyTabLayoutType>;

  #tabs: {
    tabIndex: SkyTabIndex | undefined;
  }[] = [];

  #tabCounter = 0;

  constructor() {
    this.#activeTabChange = new BehaviorSubject<SkyTabsetActiveTabChangeArgs>({
      initial: true,
      tabIndex: 0,
    });

    this.#activeTabLayout = new Subject();

    this.#activeTabUnregistered = new Subject();

    this.#focusedTabBtnIndex = new Subject();

    this.activeTabChange = this.#activeTabChange.asObservable();
    this.activeTabLayout = this.#activeTabLayout.asObservable();
    this.activeTabUnregistered = this.#activeTabUnregistered.asObservable();
    this.focusedTabBtnIndex = this.#focusedTabBtnIndex.asObservable();
  }

  public ngOnDestroy(): void {
    this.#activeTabChange.complete();
    this.#activeTabUnregistered.complete();
    this.#focusedTabBtnIndex.complete();
    this.#activeTabLayout.complete();
  }

  /**
   * Sets the active tab by its unique `tabIndex` property.
   */
  public setActiveTabIndex(
    value: SkyTabsetActiveTabChangeArgs,
    config = {
      emitChange: true,
    },
  ): void {
    if (
      value.tabIndex !== undefined &&
      !this.tabIndexesEqual(value.tabIndex, this.currentActiveTabIndex)
    ) {
      this.currentActiveTabIndex = value.tabIndex;

      /* istanbul ignore else */
      if (config.emitChange) {
        this.#activeTabChange.next(value);
      }

      this.setFocusedTabBtnIndex(value.tabIndex);
    }
  }

  public focusNextTabBtn(tabButtons: TabButtonViewModel[]): void {
    const currentTabArrayIndex = this.#tabs.findIndex((tab) =>
      this.tabIndexesEqual(tab.tabIndex, this.currentFocusedTabBtnIndex),
    );

    for (
      let i = this.#getNextTabArrayIndex(currentTabArrayIndex);
      i !== currentTabArrayIndex;
      i = this.#getNextTabArrayIndex(i)
    ) {
      const tabBtn = tabButtons[i];
      if (!tabBtn.disabled && tabBtn.tabIndex !== undefined) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public focusPrevTabBtn(tabButtons: TabButtonViewModel[]): void {
    const currentTabArrayIndex = this.#tabs.findIndex((tab) =>
      this.tabIndexesEqual(tab.tabIndex, this.currentFocusedTabBtnIndex),
    );

    for (
      let i = this.#getPrevTabArrayIndex(currentTabArrayIndex);
      i !== currentTabArrayIndex;
      i = this.#getPrevTabArrayIndex(i)
    ) {
      const tabBtn = tabButtons[i];
      if (!tabBtn.disabled && tabBtn.tabIndex !== undefined) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public focusFirstOrNearestTabBtn(tabButtons: TabButtonViewModel[]): void {
    for (const tabBtn of tabButtons) {
      if (!tabBtn.disabled && tabBtn.tabIndex !== undefined) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public focusLastOrNearestTabBtn(tabButtons: TabButtonViewModel[]): void {
    for (let i = tabButtons.length - 1; i >= 0; i--) {
      const tabBtn = tabButtons[i];

      if (!tabBtn.disabled && tabBtn.tabIndex !== undefined) {
        this.setFocusedTabBtnIndex(tabBtn.tabIndex);
        return;
      }
    }
  }

  public setFocusedTabBtnIndex(tabIndex: SkyTabIndex): void {
    this.currentFocusedTabBtnIndex = tabIndex;
    this.#focusedTabBtnIndex.next(tabIndex);
  }

  /**
   * Registers a tab component.
   */
  public registerTab(tabIndex?: SkyTabIndex): SkyTabIndex {
    if (tabIndex === undefined) {
      tabIndex = this.#tabCounter;
      this.#tabCounter++;
    }

    this.#tabs.push({ tabIndex });

    return tabIndex;
  }

  public updateTabIndex(
    currentTabIndex: SkyTabIndex,
    newTabIndex: SkyTabIndex,
  ): void {
    const found = this.#tabs.find((tab) =>
      this.tabIndexesEqual(tab.tabIndex, currentTabIndex),
    );
    if (found) {
      found.tabIndex = newTabIndex;
    }
  }

  public updateActiveTabLayout(layout: SkyTabLayoutType): void {
    this.#activeTabLayout.next(layout);
  }

  /**
   * Unregisters a tab component.
   */
  public unregisterTab(tabIndex: SkyTabIndex): void {
    const index = this.#tabs.findIndex((tab) =>
      this.tabIndexesEqual(tab.tabIndex, tabIndex),
    );

    // Notify the tabset component when an active tab is unregistered.
    if (this.#isTabIndexActive(this.#tabs[index]?.tabIndex)) {
      this.#activeTabUnregistered.next({
        arrayIndex: index,
      });
    }

    this.#tabs.splice(index, 1);
  }

  /**
   * Unregisters all tab components at once.
   */
  public unregisterAll(): void {
    this.#tabs = [];
  }

  /**
   * Compares two tab indexes and returns `true` if they are equal.
   */
  public tabIndexesEqual(
    tabIndex1: SkyTabIndex | undefined,
    tabIndex2: SkyTabIndex | undefined,
  ): boolean {
    return (
      tabIndex1 === tabIndex2 ||
      (tabIndex1 !== undefined &&
        tabIndex2 !== undefined &&
        +tabIndex1 === +tabIndex2)
    );
  }

  /**
   * Verifies if a provided tab index is registered.
   */
  public isValidTabIndex(tabIndex: SkyTabIndex): boolean {
    return this.#tabs.some((tab) =>
      this.tabIndexesEqual(tab.tabIndex, tabIndex),
    );
  }

  /**
   * Activates the first registered tab.
   */
  public activateFirstTab(): SkyTabIndex | undefined {
    const firstTabIndex = this.#tabs[0] && this.#tabs[0].tabIndex;
    if (firstTabIndex !== undefined) {
      this.setActiveTabIndex({
        tabIndex: firstTabIndex,
      });
      return firstTabIndex;
    }
    return undefined;
  }

  /**
   * Activates the next registered tab, or the previous one based on a provided array index.
   */
  public activateNearestTab(arrayIndex: number): void {
    const newActiveTab = this.#tabs[arrayIndex] || this.#tabs[arrayIndex - 1];
    if (newActiveTab) {
      this.currentActiveTabIndex = newActiveTab.tabIndex;
    }
  }

  #isTabIndexActive(tabIndex: SkyTabIndex | undefined): boolean {
    return this.tabIndexesEqual(tabIndex, this.currentActiveTabIndex);
  }

  #getNextTabArrayIndex(currentIndex: number): number {
    let nextIndex = currentIndex + 1;

    if (nextIndex === this.#tabs.length) {
      nextIndex = 0;
    }

    return nextIndex;
  }

  #getPrevTabArrayIndex(currentIndex: number): number {
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = this.#tabs.length - 1;
    }

    return prevIndex;
  }
}
