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

import {
  ActivatedRoute
} from '@angular/router';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/distinctUntilChanged';

import 'rxjs/add/operator/takeUntil';

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

  @Input()
  public set permalinkId(value: string) {
    if (!value) {
      return;
    }

    // Remove all non-alphanumeric characters.
    const sanitized = value.toLowerCase().replace(/[\W]/g, '');
    this._permalinkId = `${sanitized}-active-tab`;
  }

  public get permalinkId(): string {
    return this._permalinkId || '';
  }

  @Output()
  public newTab = new EventEmitter<any>();

  @Output()
  public openTab = new EventEmitter<any>();

  @Output()
  public activeChange = new EventEmitter<any>();

  public tabDisplayMode = 'tabs';

  @ContentChildren(SkyTabComponent)
  public tabs: QueryList<SkyTabComponent>;

  private ngUnsubscribe = new Subject<void>();

  private _permalinkId: string;

  private _tabStyle: string;

  constructor(
    private tabsetService: SkyTabsetService,
    private adapterService: SkyTabsetAdapterService,
    private elRef: ElementRef,
    private changeRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

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

  public selectTab(tab: SkyTabComponent): void {
    if (this.permalinkId && tab.permalinkValue) {
      return;
    }

    this.tabsetService.activateTab(tab);
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

    // Wait for the tab components' `active` state to be resolved before
    // listening to changes to the URL params.
    setTimeout(() => {
      this.watchQueryParamChanges();
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
      this.changeRef.markForCheck();
    }, 0);
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.tabsetService.destroy();
  }

  private updateDisplayMode(currentOverflow: boolean) {
    this.tabDisplayMode = currentOverflow ? 'dropdown' : 'tabs';
    this.changeRef.markForCheck();
  }

  private watchQueryParamChanges(): void {
    this.activatedRoute.queryParams
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params) => {
        const permalinkValue = params[this.permalinkId];
        if (permalinkValue) {
          this.activateTabByPermalinkValue(permalinkValue);
        }
      });
  }

  private activateTabByPermalinkValue(value: string): void {
    let index: number;

    this.tabs.forEach((tabComponent, i) => {
      if (tabComponent.permalinkValue === value) {
        index = i;
      }
    });

    this.tabsetService.activateTabIndex(index);
  }
}
