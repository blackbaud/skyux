import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';

import {
  ActivatedRoute,
  Params,
  Router
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
  providers: [
    SkyTabsetAdapterService,
    SkyTabsetService
  ]
})
export class SkyTabsetComponent
  implements AfterContentInit, AfterViewInit, OnDestroy, OnChanges {

  @Input()
  public get tabStyle(): string {
    return this._tabStyle || 'tabs';
  }

  public set tabStyle(value: string) {
    /*istanbul ignore else*/
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
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  public getTabButtonId(tab: SkyTabComponent): string {
    if (this.tabDisplayMode === 'tabs') {
      return `${tab.tabId}-nav-btn`;
    }

    return `${tab.tabId}-hidden-nav-btn`;
  }

  public tabCloseClick(tab: SkyTabComponent): void {
    tab.close.emit(undefined);
  }

  public newTabClick(): void {
    this.newTab.emit(undefined);
  }

  public openTabClick(): void {
    this.openTab.emit(undefined);
  }

  public windowResize(): void {
    this.adapterService.detectOverflow();
  }

  public selectTab(tab: SkyTabComponent): void {
    if (this.permalinkId && tab.permalinkValue) {
      return;
    }

    this.tabsetService.activateTab(tab);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const activeChange = changes['active'];
    if (
      activeChange &&
      activeChange.currentValue !== activeChange.previousValue
    ) {
      this.tabsetService.activateTabIndex(this.active);
    }
  }

  public ngAfterContentInit(): void {
    // Initialize each tab's index (in case tabs are instantiated out of order).
    this.tabs.forEach(tab => tab.initializeTabIndex());

    this.tabs.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe((change: QueryList<SkyTabComponent>) => {

        this.tabsetService.tabs
          .take(1)
          .subscribe(tabs => {
            change
              .filter(tab => tabs.indexOf(tab) === -1)
              .forEach(tab => tab.initializeTabIndex());

            this.adapterService.detectOverflow();
          });
      });

    if (this.active !== undefined) {
      this.tabsetService.activateTabIndex(this.active);
    }

    this.tabsetService.activeIndex
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((newActiveIndex) => {
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

  public ngAfterViewInit(): void {
    this.adapterService.init(this.elRef);

    this.adapterService.overflowChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((currentOverflow: boolean) => {
        this.updateDisplayMode(currentOverflow);
      });

    setTimeout(() => {
      this.adapterService.detectOverflow();
      this.updateDisplayMode(this.adapterService.currentOverflow);
      this.changeRef.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    /*tslint:disable-next-line:no-null-keyword*/
    this.setQueryParamPermalinkValue(null);
  }

  private updateDisplayMode(currentOverflow: boolean): void {
    this.tabDisplayMode = (currentOverflow) ? 'dropdown' : 'tabs';
    this.changeRef.markForCheck();
  }

  private watchQueryParamChanges(): void {
    this.activatedRoute.queryParams
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params) => {
        if (!this.permalinkId) {
          return;
        }

        const permalinkValue = params[this.permalinkId];
        if (permalinkValue) {
          this.activateTabByPermalinkValue(permalinkValue);
        } else {
          this.setQueryParamByActiveTab();
        }
      });
  }

  private setQueryParamByActiveTab(): void {
    this.tabsetService.tabs.take(1).subscribe((tabs) => {
      const activeTab = tabs.find(tab => tab.active);
      this.setQueryParamPermalinkValue(activeTab.permalinkValue);
    });
  }

  private activateTabByPermalinkValue(value: string): void {
    let index: number;

    this.tabs.forEach((tabComponent, i) => {
      if (tabComponent.permalinkValue === value) {
        index = i;
      }
    });

    // Only set the active tab if an index was found.
    if (index !== undefined) {
      this.tabsetService.activateTabIndex(index);
    }
  }

  private setQueryParamPermalinkValue(value: string): void {
    if (this.permalinkId) {
      const queryParams: Params = {};
      queryParams[this.permalinkId] = value;

      this.router.navigate([], {
        queryParams,
        queryParamsHandling: 'merge'
      });
    }
  }
}
