import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyTabIndex } from './tab-index';
import { SkyTabsetPermalinkService } from './tabset-permalink.service';
import { SkyTabsetService } from './tabset.service';

let nextId = 0;

@Component({
  selector: 'sky-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyTabComponent implements OnChanges, OnDestroy {
  /**
   * Indicates whether the tab is active when the tabset loads. After initialization, the `active`
   * property on the tabset component should be used to set the active tab.
   * @default false
   */
  @Input()
  public set active(value: boolean | undefined) {
    if (value !== undefined && !!value !== this.#_active) {
      this.#_active = value;
      this.#_activeChange.next();
    }
  }

  public get active(): boolean {
    return this.#_active;
  }

  public get activeChange(): Observable<void> {
    return this.#_activeChangeObs;
  }

  /**
   * Indicates whether to disable the tab.
   * @default false
   */
  @Input()
  public disabled: boolean | undefined;

  /**
   * Specifies a custom query parameter value for the tab.
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
   */
  @Input()
  public tabHeaderCount: string | undefined;

  /**
   * Specifies the tab header.
   * When using tabs as the main navigation on a page,
   * use [the Angular `Title` service](https://angular.io/docs/ts/latest/cookbook/set-document-title.html)
   * and [the SKY UX `title` configuration property](https://developer.blackbaud.com/skyux/learn/reference/configuration#app)
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
   * Specifies a unique identifier for the tab.
   * If not defined, the identifier is set to the position of the tab on load, starting with `0`.
   */
  @Input()
  public set tabIndex(value: SkyTabIndex | undefined) {
    if (
      value !== this.#_tabIndex &&
      value !== undefined &&
      this.#_tabIndex !== undefined
    ) {
      this.#tabsetService.updateTabIndex(this.#_tabIndex, value);
      this.#_tabIndexChange.next(value);
    }

    this.#_tabIndex = value;
  }

  public get tabIndex(): SkyTabIndex | undefined {
    return this.#_tabIndex;
  }

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
    return this.#_stateChangeObs;
  }

  public get tabIndexChange(): Observable<SkyTabIndex | undefined> {
    return this.#_tabIndexChangeObs;
  }

  public permalinkValueOrDefault = '';

  public showContent = false;

  public tabButtonId: string;

  public tabPanelId: string;

  #_active = false;

  #_activeChange: BehaviorSubject<void | undefined>;
  #_activeChangeObs: Observable<void | undefined>;

  #_permalinkValue: string | undefined;

  #_stateChange: BehaviorSubject<void>;
  #_stateChangeObs: Observable<void>;

  #_tabHeading: string | undefined;

  #_tabIndex: SkyTabIndex | undefined;

  #_tabIndexChange: BehaviorSubject<SkyTabIndex | undefined>;
  #_tabIndexChangeObs: Observable<SkyTabIndex | undefined>;

  #changeDetector: ChangeDetectorRef;
  #permalinkService: SkyTabsetPermalinkService;
  #tabsetService: SkyTabsetService;

  constructor(
    changeDetector: ChangeDetectorRef,
    permalinkService: SkyTabsetPermalinkService,
    tabsetService: SkyTabsetService
  ) {
    this.#changeDetector = changeDetector;
    this.#permalinkService = permalinkService;
    this.#tabsetService = tabsetService;
    const id = nextId++;
    this.tabPanelId = `sky-tab-${id}`;
    this.tabButtonId = `${this.tabPanelId}-nav-btn`;

    this.#_activeChange = new BehaviorSubject<void | undefined>(undefined);
    this.#_activeChangeObs = this.#_activeChange.asObservable();

    this.#_stateChange = new BehaviorSubject<void>(undefined);
    this.#_stateChangeObs = this.#_stateChange.asObservable();

    this.#_tabIndexChange = new BehaviorSubject<SkyTabIndex | undefined>(
      undefined
    );
    this.#_tabIndexChangeObs = this.#_tabIndexChange.asObservable();

    this.#setPermalinkValueOrDefault();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.disabled && !changes.disabled.firstChange) ||
      (changes.tabHeading && !changes.tabHeading.firstChange) ||
      (changes.tabHeaderCount && !changes.tabHeaderCount.firstChange) ||
      (changes.permalinkValue && !changes.permalinkValue.firstChange)
    ) {
      this.#_stateChange.next();
    }
  }

  public ngOnDestroy(): void {
    this.#_activeChange.complete();
    this.#_stateChange.complete();
    this.#_tabIndexChange.complete();
    if (this.tabIndex !== undefined) {
      this.#tabsetService.unregisterTab(this.tabIndex);
    }
  }

  public init(): void {
    this.#_tabIndex = this.#tabsetService.registerTab(this.tabIndex);
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
