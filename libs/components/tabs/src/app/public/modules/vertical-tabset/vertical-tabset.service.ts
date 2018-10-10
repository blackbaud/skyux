import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { SkyVerticalTabComponent } from './vertical-tab.component';
import { SkyMediaQueryService } from '@skyux/core/modules/media-query/media-query.service';
import { SkyMediaBreakpoints } from '@skyux/core/modules/media-query/media-breakpoints';

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
  private _isWidescreen: boolean = false;

  public constructor(private mediaQueryService: SkyMediaQueryService) {}

  public addTab(tab: SkyVerticalTabComponent) {
    const index = this.tabs.length;
    tab.index = index;

    this.tabs.push(tab);

    if (tab.active) {
      this.activateTab(tab);
    }

    this.tabAdded.next(tab);
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
    return this.mediaQueryService.current === SkyMediaBreakpoints.xs;
  }

  public updateContent() {
    if (!this._contentAdded && this.contentVisible()) {
      // content needs to be moved
      this.moveContent();

    } else if (this._contentAdded && !this.contentVisible()) {
      // content hidden
      this._contentAdded = false;
    }

    const mobile = this.isMobile();

    if (mobile && this._isWidescreen) {
      // switching to mobile
      this.switchingMobile.next(true);

      if (!this.tabsVisible()) {
        this.hidingTabs.next(true);
      }

    } else if (!mobile && !this._isWidescreen) {
      // switching to widescreen
      this.switchingMobile.next(false);

      if (!this._tabsVisible) {
        this.showingTabs.next(true);
      }
    }

    this._isWidescreen = !mobile;
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
