import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { SkyMediaQueryService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTabIdService } from '../shared/tab-id.service';

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
   * Whether the tab is active when the tabset loads.
   */
  @Input()
  public active: boolean | undefined = false;

  /**
   * The HTML element ID of the element that contains
   * the content that the vertical tab displays, which corresponds to the `tabId`. This property
   * [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-controls).
   * @deprecated Now that the vertical tabs provide aria labels automatically, this input is no longer necessary.
   */
  @Input()
  public ariaControls: string | undefined;

  /**
   * The ARIA role for the vertical tab
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the tab functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   * @default "tab"
   * @deprecated Any other value than `tab` could lead to a poor user experience for users with assistive technology.
   * In the next major version, this property will be automatically set to `tab`.
   */
  @Input()
  public get ariaRole(): string {
    return this.#_ariaRole;
  }
  public set ariaRole(value: string | undefined) {
    this.#_ariaRole = value ?? 'tab';
  }

  /**
   * Whether to disable the tab.
   */
  @Input()
  public disabled: boolean | undefined = false;

  /**
   * Whether to indicate that the tab has an error.
   * @internal This is used for sectioned forms and is not currently a supported design for pure vertical tabs.
   */
  @Input()
  public errorIndicator: boolean | undefined = false;

  /**
   * Displays an item count alongside the tab header to indicate how many list items the tab contains.
   */
  @Input()
  public tabHeaderCount: number | undefined;

  /**
   * The tab header.
   * @required
   */
  @Input()
  public tabHeading: string | undefined;

  /**
   * Whether to display a chevron-right icon on the right hand side of the tab.
   * @internal
   */
  @Input()
  public showTabRightArrow: boolean | undefined;

  /**
   * The ID for the tab.
   * @deprecated Now that the vertical tabs provide aria labels automatically, this input is no longer necessary.
   */
  @Input()
  public set tabId(value: string | undefined) {
    this.#tabIdOrDefault = value || this.#defaultTabId;
    this.#tabIdSvc?.register(this.#defaultTabId, this.#tabIdOrDefault);
  }

  public get tabId(): string {
    return this.#tabIdOrDefault;
  }

  public set contentRendered(value: boolean) {
    this.#_contentRendered = value;

    /* istanbul ignore else */
    if (this.#_contentRendered) {
      // NOTE: Wrapped in a setTimeout here to ensure that everything has completed rendering.
      setTimeout(() => {
        if (this.tabContent) {
          this.#updateBreakpointAndResponsiveClass();
        }
      });
    }
  }

  public get contentRendered(): boolean {
    return this.#_contentRendered;
  }

  public index: number | undefined;

  public isMobile = false;

  @ViewChild('tabContentWrapper')
  public tabContent: ElementRef | undefined;

  #_ariaRole = 'tab';

  #_contentRendered = false;

  #tabIdOrDefault: string;

  #defaultTabId: string;

  #mobileSubscription = new Subject();

  #ngUnsubscribe = new Subject<void>();

  #adapterService: SkyVerticalTabsetAdapterService;
  #changeRef: ChangeDetectorRef;
  #tabsetService: SkyVerticalTabsetService;
  #verticalTabMediaQueryService: SkyVerticalTabMediaQueryService;
  #tabIdSvc: SkyTabIdService | undefined;

  constructor(
    adapterService: SkyVerticalTabsetAdapterService,
    changeRef: ChangeDetectorRef,
    tabsetService: SkyVerticalTabsetService,
    verticalTabMediaQueryService: SkyVerticalTabMediaQueryService,
    @Optional() tabIdSvc?: SkyTabIdService
  ) {
    this.#adapterService = adapterService;
    this.#changeRef = changeRef;
    this.#tabsetService = tabsetService;
    this.#verticalTabMediaQueryService = verticalTabMediaQueryService;
    this.#tabIdSvc = tabIdSvc;

    this.#tabIdOrDefault = this.#defaultTabId = `sky-vertical-tab-${++nextId}`;
    this.tabId = this.#defaultTabId;
  }

  public ngOnInit(): void {
    this.isMobile = this.#tabsetService.isMobile();
    this.#changeRef.markForCheck();

    this.#tabsetService.switchingMobile.subscribe((mobile: boolean) => {
      this.isMobile = mobile;
      this.#changeRef.markForCheck();
    });

    // Update the breakpoint and responsive class here just as a sanity check since we can not
    // watch for element resizing.
    this.#tabsetService.indexChanged
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((index) => {
        if (this.index === index && this.contentRendered) {
          if (this.tabContent) {
            this.#updateBreakpointAndResponsiveClass();
          }
        }
      });

    this.#tabsetService.addTab(this);
  }

  public ngOnDestroy(): void {
    this.#tabIdSvc?.unregister(this.#defaultTabId);
    this.#mobileSubscription.unsubscribe();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#tabsetService.destroyTab(this);
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
      this.#tabsetService.activateTab(this);

      this.#changeRef.markForCheck();
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
    if (this.tabContent) {
      this.#updateBreakpointAndResponsiveClass();
    }
  }

  public tabDeactivated(): void {
    this.#changeRef.markForCheck();
  }

  #updateBreakpointAndResponsiveClass(): void {
    if (this.tabContent) {
      const width = this.#adapterService.getWidth(this.tabContent);
      this.#verticalTabMediaQueryService.setBreakpointForWidth(width);

      const newBreakpoint = this.#verticalTabMediaQueryService.current;

      if (newBreakpoint) {
        this.#adapterService.setResponsiveClass(this.tabContent, newBreakpoint);
      }

      this.#changeRef.markForCheck();
    }
  }
}
