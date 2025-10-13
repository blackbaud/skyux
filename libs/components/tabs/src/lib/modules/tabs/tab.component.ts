import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyTabIndex } from './tab-index';
import { SkyTabLayoutType } from './tab-layout-type';
import { SkyTabsetPermalinkService } from './tabset-permalink.service';
import { SkyTabsetService } from './tabset.service';

const LAYOUT_CLASS_PREFIX = 'sky-layout-host-';
const LAYOUT_DEFAULT: SkyTabLayoutType = 'none';

let nextId = 0;

@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyTabComponent implements OnChanges, OnDestroy {
  /**
   * Whether the tab is active when the tabset loads. After initialization, the `active`
   * property on the tabset component should be used to set the active tab.
   * @default false
   */
  @Input()
  public set active(value: boolean | undefined) {
    if (value !== undefined && !!value !== this.#_active) {
      this.#_active = value;
      this.#activeChange.next();
    }
  }

  public get active(): boolean {
    return this.#_active;
  }

  public get activeChange(): Observable<void> {
    return this.#activeChange;
  }

  /**
   * Whether to disable the tab.
   * @default false
   */
  @Input()
  public disabled: boolean | undefined;

  /**
   * The custom query parameter value for the tab.
   * This works in conjunction with the tabset's `permalinkId` to distinguish
   * the tab's unique state in the URL by generating a query parameter that is
   * written as `?<queryParam>-active-tab=<sanitized-tab-heading`.
   * By default, the query parameter's value is parsed automatically from the tab's heading text.
   * This input only applies when the tabset's `tabStyle` is `"tabs"`.
   */
  @Input()
  public set permalinkValue(value: string | undefined) {
    this.#_permalinkValue = value;
    this.#setPermalinkValueOrDefault();
  }

  public get permalinkValue(): string | undefined {
    return this.#_permalinkValue;
  }

  /**
   * Displays a counter beside the tab header.
   * This input only applies when the tabset's `tabStyle` is `"tabs"`.
   * @deprecated SKY UX no longer recommends adding counts to tabs.
   */
  @Input()
  public tabHeaderCount: string | undefined;

  /**
   * The tab header.
   * When using tabs as the main navigation on a page,
   * use [the Angular `Title` service](https://angular.dev/api/platform-browser/Title)
   * and [the SKY UX page title guidelines](https://developer.blackbaud.com/skyux/design/guidelines/content#page-titles)
   * to reflect the tab header in the page title.
   * @required
   */
  @Input()
  public set tabHeading(value: string | undefined) {
    this.#_tabHeading = value;

    this.#setPermalinkValueOrDefault();
  }

  public get tabHeading(): string | undefined {
    return this.#_tabHeading;
  }

  /**
   * The unique identifier for the tab.
   * If not defined, the identifier is set to the position of the tab on load, starting with `0`.
   */
  @Input()
  public set tabIndexValue(value: SkyTabIndex | undefined) {
    if (
      value !== this.#_tabIndexValue &&
      value !== undefined &&
      this.#_tabIndexValue !== undefined
    ) {
      this.#tabsetService.updateTabIndex(this.#_tabIndexValue, value);
      this.#tabIndexChange.next(value);
    }

    this.#_tabIndexValue = value;
  }

  public get tabIndexValue(): SkyTabIndex | undefined {
    return this.#_tabIndexValue;
  }

  /**
   * The tab layout that applies spacing to the tab container element. Use the layout
   * that corresponds with the top-level component type used within the tab, or use `fit` to
   * constrain the tab contents to the available viewport.
   * Use `none` for custom content that does not adhere to predefined spacing or constraints.
   * @default "none"
   */
  @Input()
  public set layout(value: SkyTabLayoutType | undefined) {
    const layout = value || LAYOUT_DEFAULT;

    this.#_layout = layout;
    this.cssClass = `${LAYOUT_CLASS_PREFIX}${layout}`;

    if (this.active) {
      this.#tabsetService.updateActiveTabLayout(layout);
    }
  }

  public get layout(): SkyTabLayoutType {
    return this.#_layout;
  }

  @HostBinding('class')
  public cssClass = `${LAYOUT_CLASS_PREFIX}${LAYOUT_DEFAULT}`;

  /**
   * Fires when users click the button to close the tab.
   * The close button is added to the tab when you specify a listener for this event.
   * This event only applies when the tabset's `tabStyle` is `"tabs"`.
   */
  @Output()
  public close = new EventEmitter<void>(); // eslint-disable-line @angular-eslint/no-output-native

  /**
   * Alerts the tabset component when this component has changes that need to be reflected in the UI.
   */
  public get stateChange(): Observable<void> {
    return this.#stateChange;
  }

  public get tabIndexChange(): Observable<SkyTabIndex | undefined> {
    return this.#tabIndexChange;
  }

  public permalinkValueOrDefault = '';

  public showContent = false;

  public tabButtonId: string;

  public tabPanelId: string;

  #_active = false;

  #activeChange: BehaviorSubject<void | undefined>;

  #_permalinkValue: string | undefined;

  #stateChange: BehaviorSubject<void>;

  #_tabHeading: string | undefined;

  #_tabIndexValue: SkyTabIndex | undefined;

  #_layout: SkyTabLayoutType = LAYOUT_DEFAULT;

  #tabIndexChange: BehaviorSubject<SkyTabIndex | undefined>;

  #changeDetector: ChangeDetectorRef;
  #permalinkService: SkyTabsetPermalinkService;
  #tabsetService: SkyTabsetService;

  constructor(
    changeDetector: ChangeDetectorRef,
    permalinkService: SkyTabsetPermalinkService,
    tabsetService: SkyTabsetService,
  ) {
    this.#changeDetector = changeDetector;
    this.#permalinkService = permalinkService;
    this.#tabsetService = tabsetService;
    const id = nextId++;
    this.tabPanelId = `sky-tab-${id}`;
    this.tabButtonId = `${this.tabPanelId}-nav-btn`;

    this.#activeChange = new BehaviorSubject<void | undefined>(undefined);
    this.#stateChange = new BehaviorSubject<void>(undefined);
    this.#tabIndexChange = new BehaviorSubject<SkyTabIndex | undefined>(
      undefined,
    );

    this.#setPermalinkValueOrDefault();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['disabled'] && !changes['disabled'].firstChange) ||
      (changes['tabHeading'] && !changes['tabHeading'].firstChange) ||
      (changes['tabHeaderCount'] && !changes['tabHeaderCount'].firstChange) ||
      (changes['permalinkValue'] && !changes['permalinkValue'].firstChange)
    ) {
      this.#stateChange.next();
    }
  }

  public ngOnDestroy(): void {
    this.#activeChange.complete();
    this.#stateChange.complete();
    this.#tabIndexChange.complete();
    if (this.tabIndexValue !== undefined) {
      this.#tabsetService.unregisterTab(this.tabIndexValue);
    }
  }

  public init(): void {
    this.#_tabIndexValue = this.#tabsetService.registerTab(this.tabIndexValue);
  }

  public activate(): void {
    this.#_active = true;
    this.showContent = true;
    this.#changeDetector.markForCheck();
  }

  public deactivate(): void {
    this.#_active = false;
    this.showContent = false;
    this.#changeDetector.markForCheck();
  }

  public isCloseable(): boolean {
    return this.close.observers.length > 0;
  }

  #setPermalinkValueOrDefault(): void {
    this.permalinkValueOrDefault =
      this.#permalinkService.urlify(this.permalinkValue) ||
      this.#permalinkService.urlify(this.tabHeading);
  }
}
