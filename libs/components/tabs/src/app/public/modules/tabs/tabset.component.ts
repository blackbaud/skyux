import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import 'rxjs/add/operator/distinctUntilChanged';

import {
  SkyTabComponent
} from './tab.component';

import {
  SkyTabsetAdapterService
} from './tabset-adapter.service';

import {
  SkyTabsetService
} from './tabset.service';

@Component({
  selector: 'sky-tabset',
  styleUrls: ['./tabset.component.scss'],
  templateUrl: './tabset.component.html',
  providers: [SkyTabsetAdapterService, SkyTabsetService]
})
export class SkyTabsetComponent
  implements AfterContentInit, AfterViewInit, OnDestroy, OnChanges {

  @Input()
  public get tabStyle(): string {
    return this._tabStyle || 'tabs';
  }
  public set tabStyle(value: string) {
    if (value && value.toLowerCase() === 'wizard') {
      console.warn(
        'The tabset wizard is deprecated. Please implement the new approach using ' +
        'progress indicator as documented here: https://developer.blackbaud.com/skyux/components/wizard.'
      );
    }
    this._tabStyle = value;
  }

  @Input()
  public active: number | string;

  @Output()
  public newTab = new EventEmitter<any>();

  @Output()
  public openTab = new EventEmitter<any>();

  @Output()
  public activeChange = new EventEmitter<any>();

  public tabDisplayMode = 'tabs';

  @ContentChildren(SkyTabComponent)
  public tabs: QueryList<SkyTabComponent>;

  private _tabStyle: string;

  constructor(
    private tabsetService: SkyTabsetService,
    private adapterService: SkyTabsetAdapterService,
    private elRef: ElementRef,
    private changeRef: ChangeDetectorRef
  ) {
  }

  public getTabButtonId(tab: SkyTabComponent): string {
    if (this.tabDisplayMode === 'tabs') {
      return tab.tabId + '-nav-btn';
    }
    return tab.tabId + '-hidden-nav-btn';
  }

  public tabCloseClick(tab: SkyTabComponent) {
    tab.close.emit(undefined);
  }

  public newTabClick() {
    this.newTab.emit(undefined);
  }

  public openTabClick() {
    this.openTab.emit(undefined);
  }

  public windowResize() {
    this.adapterService.detectOverflow();
  }

  public selectTab(newTab: SkyTabComponent) {
    this.tabsetService.activateTab(newTab);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && changes['active'].currentValue !== changes['active'].previousValue) {
      this.tabsetService.activateTabIndex(this.active);
    }

  }

  public ngAfterContentInit() {
    // initialize each tab's index. (in case tabs are instantiated out of order)
    this.tabs.forEach(item => item.initializeTabIndex());
    this.tabs.changes.subscribe((change: QueryList<SkyTabComponent>) => {
      this.tabsetService.tabs.take(1).subscribe(currentTabs => {
        change.filter(tab => currentTabs.indexOf(tab) < 0)
              .forEach(item => item.initializeTabIndex());
      });

      // We need the setTimeout here to ensure that the DOM actually has updated for the tab changes
      setTimeout(() => {
        this.adapterService.detectOverflow();
      }, 0);
    });

    if (this.active || this.active === 0) {
      this.tabsetService.activateTabIndex(this.active);
    }
    this.tabsetService.activeIndex.distinctUntilChanged().subscribe((newActiveIndex) => {

        // HACK: Not selecting the active tab in a timeout causes an error.
        // https://github.com/angular/angular/issues/6005
        setTimeout(() => {
          if (newActiveIndex !== this.active) {
            this.active = newActiveIndex;
            this.activeChange.emit(newActiveIndex);
          }
        });
    });
  }

  public ngAfterViewInit() {
    this.adapterService.init(this.elRef);

    this.adapterService.overflowChange.subscribe((currentOverflow: boolean) => {
      this.updateDisplayMode(currentOverflow);
    });

    setTimeout(() => {
      this.adapterService.detectOverflow();
      this.updateDisplayMode(this.adapterService.currentOverflow);
      this.changeRef.detectChanges();
    }, 0);
  }

  public ngOnDestroy() {
    this.tabsetService.destroy();
  }

  private updateDisplayMode(currentOverflow: boolean) {
    this.tabDisplayMode = currentOverflow ? 'dropdown' : 'tabs';
    this.changeRef.detectChanges();
  }
}
