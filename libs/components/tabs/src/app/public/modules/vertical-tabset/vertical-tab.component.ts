import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyVerticalTabsetService
} from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tab',
  templateUrl: './vertical-tab.component.html',
  styleUrls: ['./vertical-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyVerticalTabComponent implements OnInit, OnDestroy {
  /**
   * Indicates whether the tab is active when the tabset loads.
   */
  @Input()
  public active: boolean = false;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that contains
   * the content that the vertical tab displays, which corresponds to the `tabId`. This property
   * [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   */
  @Input()
  public get ariaControls(): string {
    return this.isMobile ? undefined : this._ariaControls;
  }
  public set ariaControls(value: string) {
    this._ariaControls = value;
  }

  /**
   * @internal
   */
  @Input()
  public ariaInvalid: boolean;

  /**
   * @internal
   */
  @Input()
  public ariaRequired: boolean;

  /**
   * Specifies an ARIA role for the vertical tab
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the tab functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
   * @default "tab"
   */
  @Input()
  public get ariaRole(): string {
    if (this.isMobile) {
      return undefined;
    }
    return this._ariaRole || 'tab';
  }
  public set ariaRole(value: string) {
    this._ariaRole = value;
  }

  /**
   * Indicates whether to disable the tab.
   */
  @Input()
  public disabled: boolean = false;

  /**
   * Displays an item count alongside the tab header to indicate how many list items the tab contains.
   */
  @Input()
  public tabHeaderCount: number;

  /**
   * Specifies the tab header.
   * @required
   */
  @Input()
  public tabHeading: string;

  /**
   * Indicates whether to display a chevron-right icon in the righthand side of the tab.
   * @internal
   */
  @Input()
  public get showTabRightArrow() {
    return this._showTabRightArrow && this.tabsetService.isMobile();
  }

  public set showTabRightArrow(value: boolean) {
    this._showTabRightArrow = value;
  }

  /**
   * Specifies an ID for the tab.
   */
  @Input()
  public tabId: string;

  public contentRendered: boolean;

  public index: number;

  @ViewChild('tabContentWrapper')
  public tabContent: ElementRef;

  private isMobile = false;

  private _ariaControls: string;

  private _ariaRole: string;

  private _mobileSubscription = new Subject();

  private _showTabRightArrow: boolean = false;

  constructor(
    private tabsetService: SkyVerticalTabsetService,
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.isMobile = this.tabsetService.isMobile();
    this.changeRef.markForCheck();

    this.tabsetService.switchingMobile
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeRef.markForCheck();
      });

    this.tabsetService.addTab(this);
  }

  public ngOnDestroy(): void {
    this._mobileSubscription.unsubscribe();
    this.tabsetService.destroyTab(this);
  }

  public tabIndex(): number {
    if (!this.disabled) {
      return 0;
    } else {
      return -1;
    }
  }

  public activateTab(): void {
    if (!this.disabled) {
      this.active = true;
      this.tabsetService.activateTab(this);

      this.changeRef.markForCheck();
    }
  }

  public tabDeactivated(): void {
    this.changeRef.markForCheck();
  }
}
