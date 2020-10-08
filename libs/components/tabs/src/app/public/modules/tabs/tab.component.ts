import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  SkyTabIndex
} from './tab-index';

import {
  SkyTabsetPermalinkService
} from './tabset-permalink.service';

import {
  SkyTabsetService
} from './tabset.service';

let nextId = 0;

@Component({
  selector: 'sky-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTabComponent implements OnChanges, OnDestroy {

  /**
   * Indicates whether the tab is active when the tabset loads. After initialization, the `active`
   * property on the tabset component should be used to set the active tab.
   * @default false
   */
  @Input()
  public set active(value: boolean) {
    if (
      value !== undefined &&
      value !== this._active
    ) {
      this._active = value;
      this._activeChange.next();
    }
  }

  public get active(): boolean {
    return this._active || false;
  }

  public get activeChange(): Observable<void> {
    return this._activeChange.asObservable();
  }

  /**
   * Indicates whether to disable the tab.
   * @default false
   */
  @Input()
  public disabled: boolean;

  /**
   * Specifies a custom query parameter value for the tab.
   * This works in conjunction with the tabset's `permalinkId` to distinguish
   * the tab's unique state in the URL by generating a query parameter that is
   * written as `?<queryParam>-active-tab=<sanitized-tab-heading`.
   * By default, the query parameter's value is parsed automatically from the tab's heading text.
   */
  @Input()
  public set permalinkValue(value: string) {
    this._permalinkValue = this.permalinkService.urlify(value);
  }

  public get permalinkValue(): string {
    return this._permalinkValue || this.permalinkService.urlify(this.tabHeading);
  }

  /**
   * Displays a counter beside the tab header.
   */
  @Input()
  public tabHeaderCount: string;

  /**
   * Specifies the tab header.
   * When using tabs as the main navigation on a page,
   * use [the Angular `Title` service](https://angular.io/docs/ts/latest/cookbook/set-document-title.html)
   * and [the SKY UX `title` configuration property](https://developer.blackbaud.com/skyux/learn/reference/configuration#app)
   * to reflect the tab header in the page title.
   * @required
   */
  @Input()
  public tabHeading: string;

  /**
   * Specifies a unique identifier for the tab.
   * If not defined, the identifier is set to the position of the tab on load, starting with `0`.
   */
  @Input()
  public tabIndex: SkyTabIndex;

  /**
   * Fires when users click the button to close the tab.
   * The close button is added to the tab when you specify a listener for this event.
   */
  @Output()
  public close = new EventEmitter<void>();

  public get closeable(): boolean {
    return this.close.observers.length > 0;
  }

  /**
   * Alerts the tabset component when this component has changes that need to be reflected in the UI.
   */
  public get stateChange(): Observable<void> {
    return this._stateChange.asObservable();
  }

  public showContent: boolean = false;

  public tabButtonId: string;

  public tabPanelId: string;

  private _active: boolean;

  private _activeChange = new BehaviorSubject<void>(undefined);

  private _permalinkValue: string;

  private _stateChange = new BehaviorSubject<void>(undefined);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private permalinkService: SkyTabsetPermalinkService,
    private tabsetService: SkyTabsetService
  ) {
    const id = nextId++;
    this.tabPanelId = `sky-tab-${id}`;
    this.tabButtonId = `${this.tabPanelId}-nav-btn`;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.disabled && !changes.disabled.firstChange ||
      changes.tabHeaderCount && !changes.tabHeaderCount.firstChange ||
      changes.permalinkValue && !changes.permalinkValue.firstChange
    ) {
      this._stateChange.next();
    }
  }

  public ngOnDestroy(): void {
    this._stateChange.complete();
    this.tabsetService.unregisterTab(this.tabIndex);
  }

  public init(): void {
    this.tabIndex = this.tabsetService.registerTab(this.tabIndex);
  }

  public activate(): void {
    this._active = true;
    this.showContent = true;
    this.changeDetector.markForCheck();
  }

  public deactivate(): void {
    this._active = false;
    this.showContent = false;
    this.changeDetector.markForCheck();
  }

}
