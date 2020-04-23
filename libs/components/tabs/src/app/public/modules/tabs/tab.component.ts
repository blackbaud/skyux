import {
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
  SkyTabsetService
} from './tabset.service';

let nextId = 0;

@Component({
  selector: 'sky-tab',
  templateUrl: './tab.component.html'
})
export class SkyTabComponent implements OnDestroy, OnChanges {

  /**
   * Indicates whether the tab is active when the tabset loads.
   * @default false
   */
  @Input()
  public active: boolean;

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
    this._permalinkValue = this.sanitizeName(value);
  }

  public get permalinkValue(): string {
    return this._permalinkValue || this.sanitizeName(this.tabHeading);
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
  public tabIndex: string | number;

  public get allowClose(): boolean {
    return this.close.observers.length > 0;
  }

  /**
   * Fires when users click the button to close the tab.
   * The close button is added to the tab when you specify a listener for this event.
   */
  @Output()
  public close = new EventEmitter<any>();

  /**
   * @internal
   */
  public tabId: string = `sky-tab-${++nextId}`;

  private _permalinkValue: string;

  constructor(private tabsetService: SkyTabsetService, private ref: ChangeDetectorRef) {}

  public initializeTabIndex() {
    this.tabsetService.addTab(this);

    if (this.active) {
      this.tabsetService.activateTab(this);
    }

    this.tabsetService.activeIndex.subscribe((activeIndex: any) => {
      this.active = this.tabIndex === activeIndex;
      this.ref.markForCheck();
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.isTabActivated(changes)) {
      this.tabsetService.activateTab(this);
    }
  }

  public ngOnDestroy() {

    this.tabsetService.destroyTab(this);

  }

  private isTabActivated(changes: SimpleChanges): boolean {
    /* istanbul ignore else */
    /* sanity check */
    if (changes) {
      let activeChange = changes['active'];
      return activeChange
        && this.tabIndex !== undefined
        && activeChange.previousValue !== activeChange.currentValue
        && this.active;
    }
  }

  private sanitizeName(value: string): string {
    if (!value) {
      return;
    }

    const sanitized = value.toLowerCase()

      // Remove special characters.
      .replace(/[\_\~\`\@\!\#\$\%\^\&\*\(\)\[\]\{\}\;\:\'\/\\\<\>\,\.\?\=\+\|"]/g, '')

      // Replace space characters with a dash.
      .replace(/\s/g, '-')

      // Remove any double-dashes.
      .replace(/--/g, '-');

    return sanitized;
  }

}
