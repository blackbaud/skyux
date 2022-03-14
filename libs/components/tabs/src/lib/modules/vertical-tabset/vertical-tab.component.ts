import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SkyMediaQueryService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyVerticalTabMediaQueryService } from './vertical-tab-media-query.service';
import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

let nextId = 0;

@Component({
  selector: 'sky-vertical-tab',
  templateUrl: './vertical-tab.component.html',
  styleUrls: ['./vertical-tab.component.scss'],
  providers: [
    SkyVerticalTabMediaQueryService,
    {
      provide: SkyMediaQueryService,
      useExisting: SkyVerticalTabMediaQueryService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyVerticalTabComponent implements OnInit, OnDestroy {
  /**
   * Indicates whether the tab is active when the tabset loads.
   */
  @Input()
  public active = false;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that contains
   * the content that the vertical tab displays, which corresponds to the `tabId`. This property
   * [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * @deprecated Now that the vertical tabs provide aria labels automatically, this input is no longer necessary.
   */
  @Input()
  public ariaControls: string;

  /**
   * Specifies an ARIA role for the vertical tab
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the tab functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
   * @default "tab"
   * @deprecated Any other value than `tab` could lead to a poor user experience for users with assistive technology.
   * In the next major version, this property will be automatically set to `tab`.
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
  public disabled = false;

  /**
   * Indicates whether to indicate that the tab has an error.
   * @internal This is used for sectioned forms and is not currently a supported design for pure vertical tabs.
   */
  @Input()
  public errorIndicator = false;

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
   * @deprecated Now that the vertical tabs provide aria labels automatically, this input is no longer necessary.
   */
  @Input()
  public tabId = `sky-vertical-tab-${++nextId}`;

  public set contentRendered(value: boolean) {
    this._contentRendered = value;

    /* istanbul ignore else */
    if (this._contentRendered) {
      // NOTE: Wrapped in a setTimeout here to ensure that everything has completed rendering.
      setTimeout(() => {
        this.updateBreakpointAndResponsiveClass(
          this.adapterService.getWidth(this.tabContent)
        );
      });
    }
  }

  public get contentRendered(): boolean {
    return this._contentRendered;
  }

  public index: number;

  public isMobile = false;

  @ViewChild('tabContentWrapper')
  public tabContent: ElementRef;

  private _ariaRole: string;

  private _contentRendered = false;

  private _mobileSubscription = new Subject();

  private _ngUnsubscribe = new Subject();

  private _showTabRightArrow = false;

  constructor(
    private adapterService: SkyVerticalTabsetAdapterService,
    private changeRef: ChangeDetectorRef,
    private tabsetService: SkyVerticalTabsetService,
    private verticalTabMediaQueryService: SkyVerticalTabMediaQueryService
  ) {}

  public ngOnInit(): void {
    this.isMobile = this.tabsetService.isMobile();
    this.changeRef.markForCheck();

    this.tabsetService.switchingMobile.subscribe((mobile: boolean) => {
      this.isMobile = mobile;
      this.changeRef.markForCheck();
    });

    // Update the breakpoint and responsive class here just as a sanity check since we can not
    // watch for element resizing.
    this.tabsetService.indexChanged
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((index) => {
        if (this.index === index && this.contentRendered) {
          this.updateBreakpointAndResponsiveClass(
            this.adapterService.getWidth(this.tabContent)
          );
        }
      });

    this.tabsetService.addTab(this);
  }

  public ngOnDestroy(): void {
    this._mobileSubscription.unsubscribe();
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
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

  public onTabButtonKeyUp(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toUpperCase()) {
        case ' ':
        case 'ENTER':
          this.activateTab();
          event.stopPropagation();
          break;
        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.updateBreakpointAndResponsiveClass(
      this.adapterService.getWidth(this.tabContent)
    );
  }

  public tabDeactivated(): void {
    this.changeRef.markForCheck();
  }

  private updateBreakpointAndResponsiveClass(width: number): void {
    this.verticalTabMediaQueryService.setBreakpointForWidth(width);

    const newBreakpiont = this.verticalTabMediaQueryService.current;

    this.adapterService.setResponsiveClass(this.tabContent, newBreakpiont);

    this.changeRef.markForCheck();
  }
}
