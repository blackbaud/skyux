import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList
} from '@angular/core';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  combineLatest,
  race,
  Subject
} from 'rxjs';

import {
  distinctUntilChanged,
  takeUntil
} from 'rxjs/operators';

import {
  SkyTabIndex
} from './tab-index';

import {
  SkyTabsetStyle
} from './tabset-style';

import {
  SkyTabComponent
} from './tab.component';

import {
  SkyTabsetAdapterService
} from './tabset-adapter.service';

import {
  SkyTabsetButtonsDisplayMode
} from './tabset-buttons-display-mode';

import {
  SkyTabsetPermalinkService
} from './tabset-permalink.service';

import {
  SkyTabsetService
} from './tabset.service';

/**
 * @internal
 */
interface TabButtonViewModel {
  active: boolean;
  ariaControls: string;
  buttonHref: string;
  buttonId: string;
  buttonText: string;
  buttonTextCount: string;
  closeable: boolean;
  disabled: boolean;
  tabIndex: SkyTabIndex;
}

@Component({
  selector: 'sky-tabset',
  styleUrls: ['./tabset.component.scss'],
  templateUrl: './tabset.component.html',
  providers: [
    SkyTabsetAdapterService,
    SkyTabsetPermalinkService,
    SkyTabsetService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTabsetComponent implements AfterViewInit, OnDestroy {

  /**
   * Activates a tab by its `tabIndex` property.
   */
  @Input()
  public set active(value: SkyTabIndex) {
    if (
      value === undefined ||
      this.tabsetService.tabIndexesEqual(value, this._active)
    ) {
      return;
    }

    if (this.tabsetService.isValidTabIndex(value)) {
      this._active = value;
      this.tabsetService.setActiveTabIndex(value);
      return;
    }

    // When a new tab is generated after initialization, wait for it to render
    // before checking if the new active tab index is valid.
    setTimeout(() => {
      if (this.tabsetService.isValidTabIndex(value)) {
        this._active = value;
        this.tabsetService.setActiveTabIndex(value);
        return;
      }

      // Activate the first tab if the new tab index is invalid.
      this._active = this.tabsetService.activateFirstTab();
    });
  }

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
   * that is written as `?<queryParam>-active-tab=<sanitized-tab-heading>`.
   * The query parameter's value is parsed automatically from the selected tab's heading text,
   * but you can supply a custom query parameter value for each tab with its `permalinkValue`.
   */
  @Input()
  public set permalinkId(value: string) {
    if (!value) {
      return;
    }

    const sanitized = this.permalinkService.urlify(value);
    this._permalinkId = `${sanitized}-active-tab`;
  }

  public get permalinkId(): string {
    return this._permalinkId || '';
  }

  /**
   * Specifies the behavior for a series of tabs.
   * @deprecated The property was designed to create wizards by setting tabStyle="wizard" on tabsets in modals,
   * but this wizard implementation was replaced by the
   * [progress indicator component](https://developer.blackbaud.com/skyux/components/progress-indicator).
   * @default 'tabs'
   */
  @Input()
  public set tabStyle(value: SkyTabsetStyle) {
    /*istanbul ignore else*/
    if (value && value.toLowerCase() === 'wizard') {
      console.warn(
        'The tabset wizard is deprecated. Please implement the new approach using ' +
        'progress indicator as documented here: https://developer.blackbaud.com/skyux/components/wizard.'
      );
    }

    this._tabStyle = value;
  }

  public get tabStyle(): SkyTabsetStyle {
    return this._tabStyle || 'tabs';
  }

  /**
   * Fires when the active tab changes. This event emits the index of the active tab.
   */
  @Output()
  public activeChange = new EventEmitter<SkyTabIndex>();

  /**
   * Fires when users click the button to add a new tab.
   * The new tab button is added to the tab area when you specify a listener for this event.
   */
  @Output()
  public newTab = new EventEmitter<void>();

  /**
   * Fires when users click the button to open a tab.
   * The open tab button is added to the tab area when you specify a listener for this event.
   */
  @Output()
  public openTab = new EventEmitter<void>();

  public set tabDisplayMode(value: SkyTabsetButtonsDisplayMode) {
    this._tabDisplayMode = value;
    this.changeDetector.markForCheck();
  }

  public get tabDisplayMode(): SkyTabsetButtonsDisplayMode {
    return this._tabDisplayMode || 'tabs';
  }

  @ContentChildren(SkyTabComponent)
  public tabs: QueryList<SkyTabComponent>;

  public dropdownTriggerButtonText: string;

  /**
   * This property is used by the deprecated tabset-nav-button component.
   * @internal
   */
  public lastActiveTabIndex: SkyTabIndex;

  public tabButtons: TabButtonViewModel[] = [];

  private ngUnsubscribe = new Subject<void>();

  private tabComponentsStateChangeUnsubscribe = new Subject<void>();

  private _active: SkyTabIndex;

  private _permalinkId: string;

  private _tabDisplayMode: SkyTabsetButtonsDisplayMode;

  private _tabStyle: SkyTabsetStyle;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private adapterService: SkyTabsetAdapterService,
    private permalinkService: SkyTabsetPermalinkService,
    private tabsetService: SkyTabsetService,
    @Optional() public themeSvc?: SkyThemeService
  ) { }

  public ngAfterViewInit(): void {

    this.initTabComponents();

    const initialTabIndex = this.getInitialTabIndex();
    this.tabsetService.setActiveTabIndex(initialTabIndex);

    this.listenTabButtonsOverflowChange();
    this.listenLocationPopStateChange();

    // Let the tabset render the initial active index before listening for changes.
    setTimeout(() => {
      this.listenTabComponentsStructuralChange();
      this.listenTabComponentsStateChange();
      this.listenActiveIndexChange();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.unsubscribeTabComponentsStateChange();
    this.permalinkService.clearParam(this.permalinkId);
  }

  public onWindowResize(): void {
    this.adapterService.detectOverflow();
  }

  public onTabCloseClick(tabButton: TabButtonViewModel): void {
    const tabComponent = this.tabs.find(tab =>
      this.tabsetService.tabIndexesEqual(tab.tabIndex, tabButton.tabIndex)
    );

    tabComponent.close.emit();
  }

  public onTabButtonClick(tabButton: TabButtonViewModel): void {
    this.tabsetService.setActiveTabIndex(tabButton.tabIndex);
  }

  public onNewTabClick(): void {
    this.newTab.emit();
  }

  public onOpenTabClick(): void {
    this.openTab.emit();
  }

  /**
   * Sets the initial active tab index based on the following criteria.
   * 1. Does the URL include a query param that reflects this tabset's active tab?
   * 2. Does one of the tab components have their `active` property set to `true`?
   * 3. Is the tabset component's `active` property set to a specific tab index?
   */
  private getInitialTabIndex(): SkyTabIndex {
    let activeIndex: SkyTabIndex = this.getActiveTabIndexByPermalinkId();
    if (activeIndex === undefined) {
      activeIndex = this.getActiveTabComponent()?.tabIndex;
      if (activeIndex === undefined) {
        activeIndex = this.active;
      }
    }

    return activeIndex;
  }

  private listenActiveIndexChange(): void {
    this.tabsetService.activeTabIndex
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(activeIndex => {
        this.updateTabsetComponent(activeIndex);
      });
  }

  private listenTabComponentsStructuralChange(): void {
    this.tabs.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.resetTabComponents();
      });
  }

  private listenTabComponentsStateChange(): void {
    combineLatest(this.tabs.map(tab => tab.activeChange))
      .pipe(takeUntil(race(this.tabComponentsStateChangeUnsubscribe, this.ngUnsubscribe)))
      .subscribe(() => {
        // Wait for the tab components to render changes before finding the active one.
        setTimeout(() => {
          const tabIndex = this.getActiveTabComponent().tabIndex;
          this.tabsetService.setActiveTabIndex(tabIndex);
        });
      });

    combineLatest(this.tabs.map(tab => tab.stateChange))
      .pipe(takeUntil(race(this.tabComponentsStateChangeUnsubscribe, this.ngUnsubscribe)))
      .subscribe(() => {
        // Wait for the tab components to render changes before finding the active one.
        setTimeout(() => {
          this.updateTabsetComponent(this.tabsetService.currentActiveTabIndex, true);
        });
      });
  }

  private initTabComponents(): void {
    this.tabs.forEach(tab => tab.init());
  }

  private resetTabComponents(): void {
    this.unsubscribeTabComponentsStateChange();
    this.tabsetService.unregisterAll();
    this.initTabComponents();
    const activeIndex = this.getActiveTabComponent()?.tabIndex;
    this.tabsetService.setActiveTabIndex(activeIndex, {
      emitChange: false
    });
    this.listenTabComponentsStateChange();
  }

  private unsubscribeTabComponentsStateChange(): void {
    this.tabComponentsStateChangeUnsubscribe.next();
    this.tabComponentsStateChangeUnsubscribe.complete();
    this.tabComponentsStateChangeUnsubscribe = new Subject<void>();
  }

  private listenTabButtonsOverflowChange(): void {
    this.adapterService.registerTabset(this.elementRef);
    this.adapterService.overflowChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(isOverflowing => {
        this.tabDisplayMode = (isOverflowing) ? 'dropdown' : 'tabs';
        this.changeDetector.markForCheck();
      });
  }

  /**
   * Listen for back/forward history button presses to detect query param changes in the URL.
   */
  private listenLocationPopStateChange(): void {
    this.permalinkService.popStateChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.setActiveTabIndexByPermalinkId();
      });
  }

  private setActiveTabIndexByPermalinkId(): void {
    const activeIndex = this.getActiveTabIndexByPermalinkId();
    this.tabsetService.setActiveTabIndex(activeIndex);
  }

  private getActiveTabIndexByPermalinkId(): SkyTabIndex {
    if (this.permalinkId) {
      const paramValue = this.permalinkService.getParam(this.permalinkId);
      if (paramValue) {
        return this.tabs.find(tab => tab.permalinkValue === paramValue)?.tabIndex;
      }
    }
  }

  private getActiveTabComponent(): SkyTabComponent {
    return this.tabs.toArray().reverse().find(tab => tab.active === true);
  }

  private createTabButtons(activeIndex: SkyTabIndex): TabButtonViewModel[] {
    return this.tabs.map(tab => ({
      active: this.tabsetService.tabIndexesEqual(tab.tabIndex, activeIndex),
      closeable: tab.closeable,
      ariaControls: tab.tabPanelId,
      disabled: tab.disabled,
      /*tslint:disable-next-line:no-null-keyword*/
      buttonHref: (tab.disabled) ? null : this.permalinkService.getParamHref(
        this.permalinkId,
        tab.permalinkValue
      ),
      buttonId: tab.tabButtonId,
      buttonTextCount: tab.tabHeaderCount,
      buttonText: tab.tabHeading,
      tabIndex: tab.tabIndex
    }));
  }

  private updateTabButtons(activeIndex: SkyTabIndex): void {
    this.tabButtons.forEach(button => {
      button.active = this.tabsetService.tabIndexesEqual(button.tabIndex, activeIndex);
    });
  }

  /**
   * Updates the UI and state of the tabset component after the tab index or
   * tab components have changed.
   * @param activeIndex The currently active tab index.
   * @param regenerateTabButtons Indicates if tab button view models should be regenerated.
   * Setting this value to `false` will simply update the existing tab buttons. Setting this value
   * to `true` is only necessary when the underlying tab components have changed and the tab
   * buttons must reflect those changes.
   */
  private updateTabsetComponent(
    activeIndex: SkyTabIndex,
    regenerateTabButtons = false
  ): void {

    // Activate/deactivate tab components.
    this.tabs.forEach(tab => {
      this.tabsetService.tabIndexesEqual(tab.tabIndex, activeIndex)
        ? tab.activate()
        : tab.deactivate();
    });

    // Update the tab button models.
    if (regenerateTabButtons || !this.tabButtons.length) {
      this.tabButtons = this.createTabButtons(activeIndex);
    } else {
      this.updateTabButtons(activeIndex);
    }

    // Update the dropdown trigger button text.
    this.dropdownTriggerButtonText = this.tabButtons.find(b => {
      return this.tabsetService.tabIndexesEqual(b.tabIndex, activeIndex);
    })?.buttonText;

    // Set the query params based on active tab.
    if (this.permalinkId) {
      const activeTabComponent = this.tabs.find(tab => {
        return this.tabsetService.tabIndexesEqual(tab.tabIndex, activeIndex);
      });
      this.permalinkService.setParam(this.permalinkId, activeTabComponent.permalinkValue);
    }

    // Wait for tab button view models to render before gauging dimensions.
    setTimeout(() => {
      this.adapterService.detectOverflow();
    });

    this.changeDetector.markForCheck();

    if (this.lastActiveTabIndex === undefined) {
      this.lastActiveTabIndex = activeIndex;
    } else {
      // Emit the new active index value to consumers.
      if (this.lastActiveTabIndex !== activeIndex) {
        this.lastActiveTabIndex = activeIndex;
        this.activeChange.emit(activeIndex);
      }
    }
  }
}
