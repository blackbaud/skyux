import { ElementRef, Injectable } from '@angular/core';

import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { SkyVerticalTabComponent } from './vertical-tab.component';

export const VISIBLE_STATE = 'shown';
export const HIDDEN_STATE = 'void';

/**
 * @internal
 */
@Injectable()
export class SkyVerticalTabsetService {
  public activeIndex: number = undefined;

  public animationContentVisibleState: string;

  public animationTabsVisibleState: string;

  public set content(value: ElementRef) {
    this._content = value;
  }

  public hidingTabs = new BehaviorSubject(false);

  public indexChanged: BehaviorSubject<number> = new BehaviorSubject(undefined);

  public maintainTabContent = false;

  public showingTabs = new BehaviorSubject(false);

  public switchingMobile: Subject<boolean> = new Subject();

  public tabs: Array<SkyVerticalTabComponent> = [];

  public tabAdded: Subject<SkyVerticalTabComponent> = new Subject();

  public tabClicked: BehaviorSubject<boolean> = new BehaviorSubject(undefined);

  private _content: ElementRef;

  private _contentAdded = false;

  private _tabsVisible = false;

  private _isMobile = false;

  public constructor(private mediaQueryService: SkyMediaQueryService) {
    this.mediaQueryService.subscribe((breakpoint) => {
      const nowMobile = breakpoint === SkyMediaBreakpoints.xs;

      if (nowMobile && !this._isMobile) {
        // switching to mobile
        this.switchingMobile.next(true);

        if (!this._tabsVisible) {
          this.hidingTabs.next(true);
        }
      } else if (!nowMobile && this._isMobile) {
        // switching to widescreen
        this.switchingMobile.next(false);

        if (!this._tabsVisible) {
          this.showingTabs.next(true);
        }
      }

      this._isMobile = nowMobile;
    });
  }

  public addTab(tab: SkyVerticalTabComponent) {
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
      this._content?.nativeElement.contains(tab.tabContent.nativeElement)
    ) {
      this._content.nativeElement.removeChild(tab.tabContent.nativeElement);
    }

    this.tabs.splice(tabIndex, 1);
    // update tab indices
    this.tabs.forEach((tabItem, index) => (tabItem.index = index));

    if (tab.active) {
      if (!this.maintainTabContent) {
        this.destroyContent();
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

  public activateTab(tab: SkyVerticalTabComponent) {
    // unactivate active tab
    const activeTab = this.tabs.find((t) => t.index === this.activeIndex);
    if (activeTab && activeTab.index !== tab.index) {
      activeTab.active = false;
      activeTab.tabDeactivated();
    }

    this.activeIndex = tab.index;
    this.tabClicked.next(true);
    this.updateTabClicked();
  }

  public activeTab(): SkyVerticalTabComponent {
    return this.tabs.find((t) => t.index === this.activeIndex);
  }

  public isMobile() {
    return this._isMobile;
  }

  public updateContent() {
    if (!this.maintainTabContent) {
      if (!this._contentAdded && this.contentVisible()) {
        // content needs to be moved
        this.moveContent();
      } else if (this._contentAdded && !this.contentVisible()) {
        // content hidden
        this._contentAdded = false;
      }
    } else {
      this.tabs.forEach((tab) => {
        if (!tab.contentRendered) {
          this._content.nativeElement.appendChild(tab.tabContent.nativeElement);
          tab.contentRendered = true;
        }
      });
    }
  }

  public tabsVisible() {
    return !this.isMobile() || this._tabsVisible;
  }

  public contentVisible() {
    return !this.isMobile() || !this._tabsVisible;
  }

  public showTabs() {
    this._tabsVisible = true;
    this._contentAdded = false;
    this.animationTabsVisibleState = VISIBLE_STATE;
    this.animationContentVisibleState = HIDDEN_STATE;
    this.showingTabs.next(true);
  }

  private destroyContent(): void {
    if (this._content) {
      this._content.nativeElement.innerHTML = '';
    }
    this.content = undefined;
  }

  private moveContent() {
    /* istanbul ignore else */
    if (this._content && !this._contentAdded) {
      const activeTab = this.activeTab();
      const activeContent = activeTab ? activeTab.tabContent : undefined;

      if (activeContent && activeContent.nativeElement) {
        this._content.nativeElement.appendChild(activeContent.nativeElement);
        activeTab.contentRendered = true;
        this._contentAdded = true;
      }
    }
  }

  private updateTabClicked() {
    this._contentAdded = false;

    if (this.isMobile()) {
      this._tabsVisible = false;
      this.animationContentVisibleState = VISIBLE_STATE;
      this.animationTabsVisibleState = HIDDEN_STATE;
      this.hidingTabs.next(true);
    }

    this.indexChanged.next(this.activeIndex);
  }
}
