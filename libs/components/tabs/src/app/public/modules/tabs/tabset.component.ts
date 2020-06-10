import {
  Location
} from '@angular/common';

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
  Optional,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  distinctUntilChanged,
  take,
  takeUntil
} from 'rxjs/operators';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyTabComponent
} from './tab.component';

import {
  SkyTabsetAdapterService
} from './tabset-adapter.service';

import {
  SkyTabsetPermalinkParams
} from './tabset-permalink-params';

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
  implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {

  /**
   * Specifies the index of the active tab.
   * @required
   */
  @Input()
  public active: number | string;

  /**
   * Defines a string value to label the tabset for accessibility.
   * If a label is visible on the screen, use the `ariaLabelledBy` property instead.
   */
  @Input()
  public ariaLabel: string;

  /**
   * Identifies the element that defines a label for the tabset.
   * If a label is not visible on the screen, use the `ariaLabel` property instead.
   */
  @Input()
  public ariaLabelledBy: string;

  /**
   * Distinguishes a tabset's unique state in the URL by generating a query parameter
   * that is written as `?<queryParam>-active-tab=<sanitized-tab-heading`.
   * The query parameter's value is parsed automatically from the selected tab's heading text,
   * but you can supply a custom query parameter value for each tab with its `permalinkValue`.
   */
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

  /**
   * Fires when the active tab changes. This event emits the index of the active tab.
   */
  @Output()
  public activeChange = new EventEmitter<any>();

  /**
   * Fires when users click the button to add a new tab.
   * The new tab button is added to the tab area when you specify a listener for this event.
   */
  @Output()
  public newTab = new EventEmitter<any>();

  /**
   * Fires when users click the button to open a tab.
   * The open tab button is added to the tab area when you specify a listener for this event.
   */
  @Output()
  public openTab = new EventEmitter<any>();

  public tabDisplayMode = 'tabs';

  @ContentChildren(SkyTabComponent)
  public tabs: QueryList<SkyTabComponent>;

  private activeIndexOnLoad: number | string;

  private ngUnsubscribe = new Subject<void>();

  private _permalinkId: string;

  constructor(
    private tabsetService: SkyTabsetService,
    private adapterService: SkyTabsetAdapterService,
    private elRef: ElementRef,
    private changeRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    @Optional() private router?: Router,
    @Optional() public themeSvc?: SkyThemeService
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
      this.setPathParamPermalinkValue(tab.permalinkValue);
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
    this.tabs.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change: QueryList<SkyTabComponent>) => {

        this.tabsetService.tabs
          .pipe(take(1))
          .subscribe(tabs => {
            change
              .filter(tab => tabs.indexOf(tab) === -1)
              .forEach(tab => tab.initializeTabIndex());

            this.adapterService.detectOverflow();
          });
      });

    if (this.active !== undefined) {
      this.activeIndexOnLoad = this.active;
      this.tabsetService.activateTabIndex(this.active);
    }

    // Render the template before activating a tab.
    setTimeout(() => {
      // Initialize each tab's index (in case tabs are instantiated out of order).
      this.tabs.forEach(tab => tab.initializeTabIndex());
      this.activateTabByPermalinkValue();
    });

    this.tabsetService.activeIndex
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((newActiveIndex) => {
        // HACK: Not selecting the active tab in a timeout causes an error.
        // https://github.com/angular/angular/issues/6005
        setTimeout(() => {
          if (newActiveIndex !== this.active) {
            this.active = newActiveIndex;
            if (this.activeIndexOnLoad === undefined) {
              this.activeIndexOnLoad = newActiveIndex;
            }
            this.activeChange.emit(newActiveIndex);
          }
        });
      });

      // Listen for back/forward history button presses to detect path param changes in the URL.
      // (Angular's router events observable doesn't emit when path params change.)
      // See: https://stackoverflow.com/a/51471155/6178885
      fromEvent(window, 'popstate')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => this.activateTabByPermalinkValue());
  }

  public ngAfterViewInit(): void {
    this.adapterService.init(this.elRef);

    this.adapterService.overflowChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentOverflow: boolean) => {
        this.updateDisplayMode(currentOverflow);
      });

    // Render the template before setting display mode.
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
    this.setPathParamPermalinkValue(null);
  }

  public getPathParams(): SkyTabsetPermalinkParams {
    const params: SkyTabsetPermalinkParams = {};

    const existingParamPairs = this.location.path().split(';');
    existingParamPairs.shift();
    existingParamPairs.forEach((pair) => {
      const fragments = pair.split('=');
      params[fragments[0]] = fragments[1];
    });

    return params;
  }

  private updateDisplayMode(currentOverflow: boolean): void {
    this.tabDisplayMode = (currentOverflow) ? 'dropdown' : 'tabs';
    this.changeRef.markForCheck();
  }

  private activateTabByPermalinkValue(): void {
    const params = this.getPathParams();

    if (
      !(this.permalinkId in params) &&
      this.activeIndexOnLoad !== undefined
    ) {
      this.tabsetService.activateTabIndex(this.activeIndexOnLoad);
      return;
    }

    const value = params[this.permalinkId];

    let index: number | string;

    this.tabs.forEach((tabComponent, i) => {
      if (tabComponent.permalinkValue === value) {
        index = tabComponent.tabIndex;
      }
    });

    // Only set the active tab if an index was found.
    if (index !== undefined) {
      this.tabsetService.activateTabIndex(index);
    }
  }

  private setPathParamPermalinkValue(value: string): void {
    if (this.permalinkId) {
      const params = this.getPathParams();

      params[this.permalinkId] = value;

      // Update the URL without triggering a navigation state change.
      // See: https://stackoverflow.com/a/46486677
      const url = this.router.createUrlTree([params], {
        relativeTo: this.activatedRoute
      }).toString();

      this.location.go(url);
    }
  }
}
