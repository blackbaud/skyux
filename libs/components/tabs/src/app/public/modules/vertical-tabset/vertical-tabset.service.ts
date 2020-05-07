import {
  ElementRef,
  Injectable
} from '@angular/core';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyVerticalTabComponent
} from './vertical-tab.component';

export const VISIBLE_STATE = 'shown';

@Injectable()
export class SkyVerticalTabsetService {

  public tabs: Array<SkyVerticalTabComponent> = [];
  public tabClicked: BehaviorSubject<boolean> = new BehaviorSubject(undefined);
  public activeIndex: number = undefined;

  public hidingTabs = new BehaviorSubject(false);
  public showingTabs = new BehaviorSubject(false);
  public tabAdded: Subject<SkyVerticalTabComponent> = new Subject();
  public indexChanged: BehaviorSubject<number> = new BehaviorSubject(undefined);
  public switchingMobile: Subject<boolean> = new Subject();

  public animationVisibleState: string;

  private _content: ElementRef;

  public set content(value: ElementRef) {
    this._content = value;
  }

  private _tabsVisible: boolean = false;
  private _contentAdded: boolean = false;
  private _isMobile: boolean = false;

  public constructor(private mediaQueryService: SkyMediaQueryService) {
    this.mediaQueryService.subscribe(breakpoint => {
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
    let tabIndex = this.tabs.indexOf(tab);
    if (tab.active) {
      this.destroyContent();

      // Try selecting the next tab first, and if there's no next tab then
      // try selecting the previous one.
      let newActiveTab = this.tabs[tabIndex + 1] || this.tabs[tabIndex - 1];
      /*istanbul ignore else */
      if (newActiveTab) {
        newActiveTab.activateTab();
      }
    }

    if (tabIndex > -1) {
      this.tabs.splice(tabIndex, 1);
    }
  }

  public activateTab(tab: SkyVerticalTabComponent) {

    // unactivate active tab
    let activeTab = this.tabs.find(t => t.index === this.activeIndex);
    if (activeTab && activeTab.index !== tab.index) {
      activeTab.active = false;
      activeTab.tabDeactivated();
    }

    this.activeIndex = tab.index;
    this.tabClicked.next(true);
    this.updateTabClicked();
  }

  public activeTabContent(): ElementRef {
    let activeTab = this.tabs.find(t => t.index === this.activeIndex);

    if (activeTab) {
      return activeTab.tabContent;
    } else {
      return undefined;
    }
  }

  public isMobile() {
    return this._isMobile;
  }

  public updateContent() {
    if (!this._contentAdded && this.contentVisible()) {
      // content needs to be moved
      this.moveContent();

    } else if (this._contentAdded && !this.contentVisible()) {
      // content hidden
      this._contentAdded = false;
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
    this.animationVisibleState = VISIBLE_STATE;
    this.showingTabs.next(true);
  }

  private destroyContent(): void {
    if (this._content) {
      this._content.nativeElement.innerHTML = '';
    }
    this.content = undefined;
  }

  private moveContent() {
    if (this._content && !this._contentAdded) {
      let activeContent = this.activeTabContent();

      if (activeContent && activeContent.nativeElement) {
        this._content.nativeElement.appendChild(activeContent.nativeElement);
        this._contentAdded = true;
      }
    }
  }

  private updateTabClicked() {
    this._contentAdded = false;

    if (this.isMobile()) {
      this._tabsVisible = false;
      this.animationVisibleState = VISIBLE_STATE;
      this.hidingTabs.next(true);
    }

    this.indexChanged.next(this.activeIndex);
  }
}
