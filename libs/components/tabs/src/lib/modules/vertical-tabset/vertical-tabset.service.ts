import { ElementRef, Injectable } from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

import { SkyVerticalTabComponent } from './vertical-tab.component';

export const VISIBLE_STATE = 'shown';
export const HIDDEN_STATE = 'void';

/**
 * @internal
 */
@Injectable()
export class SkyVerticalTabsetService {
  public activeIndex: number | undefined = undefined;

  public animationContentVisibleState: string | undefined;

  public animationTabsVisibleState: string | undefined;

  public content: ElementRef | undefined;

  public hidingTabs = new BehaviorSubject(false);

  public indexChanged: ReplaySubject<number | undefined> = new ReplaySubject(1);

  public maintainTabContent: boolean | undefined = false;

  public showingTabs = new BehaviorSubject(false);

  public switchingMobile: Subject<boolean> = new Subject();

  public tabs: Array<SkyVerticalTabComponent> = [];

  public tabAdded: Subject<SkyVerticalTabComponent> = new Subject();

  public tabClicked: ReplaySubject<boolean> = new ReplaySubject(1);

  #contentAdded = false;

  #tabsVisible = false;

  #isMobile = false;

  #mediaQueryService: SkyMediaQueryService;

  public constructor(mediaQueryService: SkyMediaQueryService) {
    this.#mediaQueryService = mediaQueryService;
    this.#mediaQueryService.subscribe((breakpoint) => {
      const nowMobile = breakpoint === SkyMediaBreakpoints.xs;

      if (nowMobile && !this.#isMobile) {
        // switching to mobile
        this.switchingMobile.next(true);

        if (!this.#tabsVisible) {
          this.hidingTabs.next(true);
        }
      } else if (!nowMobile && this.#isMobile) {
        // switching to widescreen
        this.switchingMobile.next(false);

        if (!this.#tabsVisible) {
          this.showingTabs.next(true);
        }
      }

      this.#isMobile = nowMobile;
    });
  }

  public addTab(tab: SkyVerticalTabComponent): void {
    const index = this.tabs.length;
    tab.index = index;

    this.tabs.push(tab);

    if (tab.active) {
      this.activateTab(tab);
    }

    this.tabAdded.next(tab);
  }

  public destroyTab(tab: SkyVerticalTabComponent): void {
    const tabIndex = this.tabs.indexOf(tab);
    if (tabIndex === -1) {
      return;
    }

    if (
      this.maintainTabContent &&
      tab.contentRendered &&
      /* istanbul ignore next */
      this.content?.nativeElement.contains(tab.tabContent?.nativeElement)
    ) {
      this.content?.nativeElement.removeChild(tab.tabContent?.nativeElement);
    }

    this.tabs.splice(tabIndex, 1);
    // update tab indices
    this.tabs.forEach((tabItem, index) => (tabItem.index = index));

    if (tab.active) {
      if (!this.maintainTabContent) {
        this.#destroyContent();
      }
      // Try selecting the next tab first, and if there's no next tab then
      // try selecting the previous one.
      const newActiveTab = this.tabs[tabIndex] || this.tabs[tabIndex - 1];
      /*istanbul ignore else */
      if (newActiveTab) {
        newActiveTab.activateTab();
      }
    }
  }

  public activateTab(tab: SkyVerticalTabComponent): void {
    // unactivate active tab
    const activeTab = this.tabs.find((t) => t.index === this.activeIndex);
    if (activeTab && activeTab.index !== tab.index) {
      activeTab.active = false;
      activeTab.tabDeactivated();
    }

    this.activeIndex = tab.index;
    this.tabClicked.next(true);
    this.#updateTabClicked();
  }

  public activeTab(): SkyVerticalTabComponent | undefined {
    return this.tabs.find((t) => t.index === this.activeIndex);
  }

  public isMobile(): boolean {
    return this.#isMobile;
  }

  public updateContent(): void {
    if (!this.maintainTabContent) {
      if (!this.#contentAdded && this.contentVisible()) {
        // content needs to be moved
        this.#moveContent();
      } else if (this.#contentAdded && !this.contentVisible()) {
        // content hidden
        this.#contentAdded = false;
      }
    } else {
      this.tabs.forEach((tab) => {
        if (!tab.contentRendered) {
          this.content?.nativeElement.appendChild(
            tab.tabContent?.nativeElement
          );
          tab.contentRendered = true;
        }
      });
    }
  }

  public tabsVisible(): boolean {
    return !this.isMobile() || this.#tabsVisible;
  }

  public contentVisible(): boolean {
    return !this.isMobile() || !this.#tabsVisible;
  }

  public showTabs(): void {
    this.#tabsVisible = true;
    this.#contentAdded = false;
    this.animationTabsVisibleState = VISIBLE_STATE;
    this.animationContentVisibleState = HIDDEN_STATE;
    this.showingTabs.next(true);
  }

  #destroyContent(): void {
    if (this.content) {
      this.content.nativeElement.innerHTML = '';
    }
    this.content = undefined;
  }

  #moveContent(): void {
    /* istanbul ignore else */
    if (this.content && !this.#contentAdded) {
      const activeTab = this.activeTab();
      const activeContent = activeTab ? activeTab.tabContent : undefined;

      if (activeContent && activeTab && activeContent.nativeElement) {
        this.content.nativeElement.appendChild(activeContent.nativeElement);
        activeTab.contentRendered = true;
        this.#contentAdded = true;
      }
    }
  }

  #updateTabClicked(): void {
    this.#contentAdded = false;

    if (this.isMobile()) {
      this.#tabsVisible = false;
      this.animationContentVisibleState = VISIBLE_STATE;
      this.animationTabsVisibleState = HIDDEN_STATE;
      this.hidingTabs.next(true);
    }

    this.indexChanged.next(this.activeIndex);
  }
}
