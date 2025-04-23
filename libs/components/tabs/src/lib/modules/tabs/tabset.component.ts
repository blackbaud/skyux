import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyLayoutHostService } from '@skyux/core';

import { Subject, combineLatest, race } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { TabButtonViewModel } from './tab-button-view-model';
import { SkyTabIndex } from './tab-index';
import { SkyTabLayoutType } from './tab-layout-type';
import { SkyTabComponent } from './tab.component';
import { SkyTabsetAdapterService } from './tabset-adapter.service';
import { SkyTabsetButtonsDisplayMode } from './tabset-buttons-display-mode';
import { SkyTabsetPermalinkService } from './tabset-permalink.service';
import { SkyTabsetStyle } from './tabset-style';
import { SkyTabsetTabIndexesChange } from './tabset-tab-indexes-change';
import { SkyTabsetService } from './tabset.service';

@Component({
  selector: 'sky-tabset',
  styleUrls: ['./tabset.component.scss'],
  templateUrl: './tabset.component.html',
  providers: [
    SkyTabsetAdapterService,
    SkyTabsetPermalinkService,
    SkyTabsetService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyTabsetComponent implements AfterViewInit, OnDestroy {
  /**
   * Activates a tab by its `tabIndex` property.
   */
  @Input()
  public set active(value: SkyTabIndex | undefined) {
    if (
      value === undefined ||
      this.#tabsetService.tabIndexesEqual(value, this.#_active)
    ) {
      return;
    }

    this.#_active = value;

    if (this.tabs) {
      this.#tabsetService.setActiveTabIndex({ tabIndex: value });
    } else {
      // On init, wait for children tabs to render before broadcasting the active tab index.
      setTimeout(() => {
        if (this.#tabsetService.isValidTabIndex(value)) {
          // On init, yield to the permalink ID, if it exists.
          if (this.#getActiveTabIndexByPermalinkId() === undefined) {
            this.#tabsetService.setActiveTabIndex({ tabIndex: value });
          }
        } else {
          // Activate the first tab if the new tab index is invalid.
          this.#_active = this.#tabsetService.activateFirstTab();
        }
      });
    }
  }

  public get active(): SkyTabIndex | undefined {
    return this.#_active;
  }

  /**
   * The ARIA label for the tabset. This sets the tabset's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * The HTML element ID of the element that labels
   * the tabset. This sets the tabset's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * Distinguishes a tabset's unique state in the URL by generating a query parameter
   * that is written as `?<queryParam>-active-tab=<sanitized-tab-heading>`.
   * The query parameter's value is parsed automatically from the selected tab's heading text,
   * but you can supply a custom query parameter value for each tab with its `permalinkValue`.
   * This input only applies when `tabStyle` is `"tabs"`
   */
  @Input()
  public set permalinkId(value: string | undefined) {
    if (!value) {
      this.#_permalinkId = '';
    } else {
      const sanitized = this.#permalinkService.urlify(value);
      this.#_permalinkId = `${sanitized}-active-tab`;
    }
  }

  public get permalinkId(): string {
    return this.#_permalinkId;
  }

  /**
   * The behavior for a series of tabs.
   * @default "tabs"
   */
  @Input()
  public set tabStyle(value: SkyTabsetStyle | undefined) {
    this.#_tabStyle = value || 'tabs';
  }

  public get tabStyle(): SkyTabsetStyle {
    return this.#_tabStyle;
  }

  @HostBinding('attr.data-tab-style') public get dataTabStyle(): string {
    return this.tabStyle;
  }

  /**
   * Fires when the active tab changes. This event emits the index of the active tab.
   */
  @Output()
  public activeChange = new EventEmitter<SkyTabIndex>();

  /**
   * Fires when users click the button to add a new tab.
   * The new tab button is added to the tab area when you specify a listener for this event.
   * This event only applies when `tabStyle` is `"tabs"`.
   */
  @Output()
  public newTab = new EventEmitter<void>();

  /**
   * Fires when users click the button to open a tab.
   * The open tab button is added to the tab area when you specify a listener for this event.
   * This event only applies when `tabStyle` is `"tabs"`.
   */
  @Output()
  public openTab = new EventEmitter<void>();

  /**
   * Fires when any tab's `tabIndex` value changes.
   * This event only applies when `tabStyle` is `"tabs"`.
   */
  @Output()
  public tabIndexesChange = new EventEmitter<SkyTabsetTabIndexesChange>();

  public set tabDisplayMode(value: SkyTabsetButtonsDisplayMode) {
    this.#_tabDisplayMode = value;
    this.#changeDetector.markForCheck();
  }

  public get tabDisplayMode(): SkyTabsetButtonsDisplayMode {
    return this.#_tabDisplayMode;
  }

  @ContentChildren(SkyTabComponent)
  public set tabs(value: QueryList<SkyTabComponent> | undefined) {
    this.#_tabs = value;
    this.#tabComponentsChangeUnsubscribe.next();

    value?.changes
      .pipe(takeUntil(this.#tabComponentsChangeUnsubscribe))
      .subscribe(() => {
        this.#resetTabComponents();
      });
  }

  public get tabs(): QueryList<SkyTabComponent> | undefined {
    return this.#_tabs;
  }

  @HostBinding('class')
  public cssClass = 'sky-tabset-layout-none';

  public dropdownTriggerButtonText = '';

  /**
   * This property is used by the deprecated tabset-nav-button component.
   * @internal
   */
  public lastActiveTabIndex: SkyTabIndex | undefined;

  public tabButtons: TabButtonViewModel[] = [];

  #ngUnsubscribe = new Subject<void>();

  #tabComponentsChangeUnsubscribe = new Subject<void>();
  #tabComponentsStateChangeUnsubscribe = new Subject<void>();

  #_active: SkyTabIndex | undefined;

  #_permalinkId = '';

  #_tabs: QueryList<SkyTabComponent> | undefined;

  #_tabDisplayMode: SkyTabsetButtonsDisplayMode = 'tabs';

  #_tabStyle: SkyTabsetStyle = 'tabs';

  #changeDetector: ChangeDetectorRef;
  #elementRef: ElementRef;
  #adapterService: SkyTabsetAdapterService;
  #permalinkService: SkyTabsetPermalinkService;
  #tabsetService: SkyTabsetService;

  #layoutHostSvc = inject(SkyLayoutHostService, { optional: true });

  constructor(
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    adapterService: SkyTabsetAdapterService,
    permalinkService: SkyTabsetPermalinkService,
    tabsetService: SkyTabsetService,
  ) {
    this.#changeDetector = changeDetector;
    this.#elementRef = elementRef;
    this.#adapterService = adapterService;
    this.#permalinkService = permalinkService;
    this.#tabsetService = tabsetService;
  }

  public ngAfterViewInit(): void {
    this.#initTabComponents();

    const initialTabIndex = this.#getInitialTabIndex();
    this.#tabsetService.setActiveTabIndex({
      tabIndex: initialTabIndex,
      initial: true,
    });

    this.#listenTabButtonsOverflowChange();
    this.#listenLocationPopStateChange();

    // If the currently active tab is getting unregistered, activate the next one.
    this.#tabsetService.activeTabUnregistered
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((tab) => {
        // Wait for the new tabs to render before activating.
        setTimeout(() => {
          this.#tabsetService.activateNearestTab(tab.arrayIndex);
        });
      });

    this.#tabsetService.activeTabLayout
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((layout) => {
        this.#updateLayout(layout);
      });

    // Let the tabset render the initial active index before listening for changes.
    setTimeout(() => {
      this.#listenTabComponentsStateChange();
      this.#listenActiveIndexChange();
      this.#permalinkService.init();
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#tabComponentsChangeUnsubscribe.next();
    this.#tabComponentsChangeUnsubscribe.complete();
    this.#unsubscribeTabComponentsStateChange();
    if (this.permalinkId) {
      this.#permalinkService.clearParam(this.permalinkId);
    }
  }

  public onWindowResize(): void {
    this.#adapterService.detectOverflow();
  }

  public onTabCloseClick(tabButton: TabButtonViewModel): void {
    const tabComponent = this.tabs?.find((tab) =>
      this.#tabsetService.tabIndexesEqual(
        tab.tabIndexValue,
        tabButton.tabIndex,
      ),
    );

    tabComponent?.close.emit();
  }

  public onTabButtonClick(tabButton: TabButtonViewModel): void {
    this.#tabsetService.setActiveTabIndex({ tabIndex: tabButton.tabIndex });
  }

  public onNewTabClick(): void {
    this.newTab.emit();
  }

  public onOpenTabClick(): void {
    this.openTab.emit();
  }

  public onRightKeyDown(): void {
    this.#tabsetService.focusNextTabBtn(this.tabButtons);
  }

  public onLeftKeyDown(): void {
    this.#tabsetService.focusPrevTabBtn(this.tabButtons);
  }

  public onHomeKeyDown(): void {
    this.#tabsetService.focusFirstOrNearestTabBtn(this.tabButtons);
  }

  public onEndKeyDown(): void {
    this.#tabsetService.focusLastOrNearestTabBtn(this.tabButtons);
  }

  /**
   * Sets the initial active tab index based on the following criteria.
   * 1. Does the URL include a query param that reflects this tabset's active tab?
   * 2. Does one of the tab components have their `active` property set to `true`?
   * 3. Is the tabset component's `active` property set to a specific tab index?
   */
  #getInitialTabIndex(): SkyTabIndex | undefined {
    let activeIndex: SkyTabIndex | undefined =
      this.#getActiveTabIndexByPermalinkId();
    if (activeIndex === undefined) {
      activeIndex = this.#getActiveTabComponent()?.tabIndexValue;
      if (activeIndex === undefined) {
        activeIndex = this.active;
      }
    }

    return activeIndex;
  }

  #listenActiveIndexChange(): void {
    this.#tabsetService.activeTabChange
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((tabChange) => {
        this.#updateTabsetComponent(
          tabChange.tabIndex,
          false,
          tabChange.initial,
        );
        const activeTab = this.#getActiveTabComponent();

        this.#updateLayout(activeTab?.layout);
      });
  }

  #updateLayout(layout?: SkyTabLayoutType): void {
    if (this.#layoutHostSvc && layout) {
      this.#layoutHostSvc.setHostLayoutForChild({
        layout,
      });

      this.cssClass = `sky-tabset-layout-${layout}`;
    }
  }

  #listenTabComponentsStateChange(): void {
    if (this.tabs) {
      combineLatest(this.tabs.map((tab) => tab.activeChange))
        .pipe(
          takeUntil(
            race(
              this.#tabComponentsStateChangeUnsubscribe,
              this.#ngUnsubscribe,
            ),
          ),
        )
        .subscribe(() => {
          // Wait for the tab components to render changes before finding the active one.
          setTimeout(() => {
            const tabIndex = this.#getActiveTabComponent()?.tabIndexValue;
            this.#tabsetService.setActiveTabIndex({ tabIndex });
          });
        });

      combineLatest(this.tabs.map((tab) => tab.tabIndexChange))
        .pipe(
          takeUntil(
            race(
              this.#tabComponentsStateChangeUnsubscribe,
              this.#ngUnsubscribe,
            ),
          ),
        )
        .subscribe(() => {
          // Don't emit the first change.
          if (this.lastActiveTabIndex !== undefined) {
            // Wait for the tab components to render changes before updating the view.
            setTimeout(() => {
              this.#updateTabsetComponent(
                this.#tabsetService.currentActiveTabIndex,
                true,
              );
              this.#emitTabIndexChange();
            });
          }
        });

      combineLatest(this.tabs.map((tab) => tab.stateChange))
        .pipe(
          takeUntil(
            race(
              this.#tabComponentsStateChangeUnsubscribe,
              this.#ngUnsubscribe,
            ),
          ),
        )
        .subscribe(() => {
          // Wait for the tab components to render changes before finding the active one.
          setTimeout(() => {
            this.#updateTabsetComponent(
              this.#tabsetService.currentActiveTabIndex,
              true,
            );
          });
        });
    }
  }

  #initTabComponents(): void {
    this.tabs?.forEach((tab) => tab.init());
  }

  #resetTabComponents(): void {
    this.#unsubscribeTabComponentsStateChange();
    this.#tabsetService.unregisterAll();

    // If there are no tab components, do a hard reset of the view.
    if (this.tabs?.length === 0) {
      this.#updateTabsetComponent(0, true);
      return;
    }

    this.#initTabComponents();
    const activeIndex = this.#getActiveTabComponent()?.tabIndexValue;
    this.#tabsetService.setActiveTabIndex(
      {
        tabIndex: activeIndex,
      },
      {
        emitChange: false,
      },
    );
    this.#listenTabComponentsStateChange();
  }

  #emitTabIndexChange(): void {
    this.tabIndexesChange.emit({
      tabs: this.tabs?.map((tab) => ({
        tabHeading: tab.tabHeading,
        tabIndex: tab.tabIndexValue,
      })),
    });
  }

  #unsubscribeTabComponentsStateChange(): void {
    this.#tabComponentsStateChangeUnsubscribe.next();
    this.#tabComponentsStateChangeUnsubscribe.complete();
    this.#tabComponentsStateChangeUnsubscribe = new Subject<void>();
  }

  #listenTabButtonsOverflowChange(): void {
    this.#adapterService.registerTabset(this.#elementRef);
    this.#adapterService.overflowChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((isOverflowing) => {
        this.tabDisplayMode = isOverflowing ? 'dropdown' : 'tabs';
        this.#changeDetector.markForCheck();
      });
  }

  /**
   * Listen for back/forward history button presses to detect query param changes in the URL.
   */
  #listenLocationPopStateChange(): void {
    this.#permalinkService.popStateChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#setActiveTabIndexByPermalinkId();
      });
  }

  #setActiveTabIndexByPermalinkId(): void {
    const activeIndex = this.#getActiveTabIndexByPermalinkId();
    this.#tabsetService.setActiveTabIndex({
      tabIndex: activeIndex,
    });
  }

  #getActiveTabIndexByPermalinkId(): SkyTabIndex | undefined {
    if (this.permalinkId) {
      const paramValue = this.#permalinkService.getParam(this.permalinkId);
      if (paramValue) {
        return this.tabs?.find(
          (tab) => tab.permalinkValueOrDefault === paramValue,
        )?.tabIndexValue;
      }
      return undefined;
    }
    return undefined;
  }

  #getActiveTabComponent(): SkyTabComponent | undefined {
    return this.tabs
      ?.toArray()
      .reverse()
      .find((tab) => tab.active === true);
  }

  #createTabButtons(
    activeIndex: SkyTabIndex | undefined,
  ): TabButtonViewModel[] {
    // Safety check
    /* istanbul ignore next */
    if (!this.tabs) {
      return [];
    }

    return this.tabs.map((tab, index) => ({
      active: this.#tabsetService.tabIndexesEqual(
        tab.tabIndexValue,
        activeIndex,
      ),
      closeable: tab.isCloseable(),
      ariaControls: tab.tabPanelId,
      disabled: tab.disabled,
      buttonHref: tab.disabled
        ? null
        : this.#permalinkService.getParamHref(
            this.permalinkId,
            tab.permalinkValueOrDefault,
          ),
      buttonId: tab.tabButtonId,
      buttonTextCount: tab.tabHeaderCount,
      buttonText: tab.tabHeading,
      tabIndex: tab.tabIndexValue,
      tabNumber: index + 1,
      totalTabsCount: this.tabs!.length,
    }));
  }

  #updateTabButtons(activeIndex: SkyTabIndex | undefined): void {
    this.tabButtons.forEach((button) => {
      button.active = this.#tabsetService.tabIndexesEqual(
        button.tabIndex,
        activeIndex,
      );
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
   * @param initial Indicates whether tabs are being updated during initialization of the tabset
   * component. This is passed through to the permalink service where it prevents adding an extra
   * item to browser history when the URL is updated with the selected tab's permalink value.
   */
  #updateTabsetComponent(
    activeIndex: SkyTabIndex | undefined,
    regenerateTabButtons: boolean,
    initial?: boolean,
  ): void {
    // Activate/deactivate tab components.
    this.tabs?.forEach((tab) => {
      if (this.#tabsetService.tabIndexesEqual(tab.tabIndexValue, activeIndex)) {
        tab.activate();
      } else {
        tab.deactivate();
      }
    });

    // Update the tab button models.
    if (regenerateTabButtons || !this.tabButtons.length) {
      this.tabButtons = this.#createTabButtons(activeIndex);
    } else {
      this.#updateTabButtons(activeIndex);
    }

    // Update the dropdown trigger button text.
    this.dropdownTriggerButtonText =
      this.tabButtons.find((b) => {
        return this.#tabsetService.tabIndexesEqual(b.tabIndex, activeIndex);
      })?.buttonText ?? '';

    // Set the query params based on active tab.
    if (this.permalinkId) {
      const activeTabComponent = this.tabs?.find((tab) => {
        return this.#tabsetService.tabIndexesEqual(
          tab.tabIndexValue,
          activeIndex,
        );
      });
      if (activeTabComponent) {
        this.#permalinkService.setParam(
          this.permalinkId,
          activeTabComponent.permalinkValueOrDefault,
          initial,
        );
      }
    }

    // Wait for tab button view models to render before gauging dimensions.
    setTimeout(() => {
      this.#adapterService.detectOverflow();
    });

    this.#changeDetector.markForCheck();

    // Emit the new active index value to consumers.
    if (this.lastActiveTabIndex !== activeIndex) {
      this.lastActiveTabIndex = activeIndex;
      this.activeChange.emit(activeIndex);
    }
  }
}
