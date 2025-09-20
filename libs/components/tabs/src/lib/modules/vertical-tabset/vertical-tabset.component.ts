import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyTabIdService } from '../shared/tab-id.service';

import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import {
  HIDDEN_STATE,
  SkyVerticalTabsetService,
  VISIBLE_STATE,
} from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tabset',
  templateUrl: './vertical-tabset.component.html',
  styleUrls: ['./vertical-tabset.component.scss'],
  providers: [SkyTabIdService, SkyVerticalTabsetService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tabGroupEnter', [
      transition(`${HIDDEN_STATE} => ${VISIBLE_STATE}`, [
        style({ transform: 'translate(-100%)' }),
        animate('150ms ease-in'),
      ]),
    ]),
    trigger('contentEnter', [
      transition(`${HIDDEN_STATE} => ${VISIBLE_STATE}`, [
        style({ transform: 'translate(100%)' }),
        animate('150ms ease-in'),
      ]),
    ]),
  ],
  standalone: false,
})
export class SkyVerticalTabsetComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  /**
   * The text to display on the show tabs button on mobile devices.
   */
  @Input()
  public showTabsText: string | undefined;

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
   * The ARIA role for the vertical tabset
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the tabset functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   * @default "tablist"
   * @deprecated Any other value than `tablist` could lead to a poor user experience for users with assistive technology.
   * In the next major version, this property will be automatically set to `tablist`.
   */
  @Input()
  public get ariaRole(): string {
    return this.#_ariaRole;
  }

  public set ariaRole(value: string | undefined) {
    this.#_ariaRole = value ?? 'tablist';
  }

  /**
   * Whether the vertical tabset loads tab content during initialization so that it
   * displays content without moving around elements in the content container.
   * @default false
   */
  @Input()
  public maintainTabContent: boolean | undefined = false;

  /**
   * Fires when the active tab changes. Emits the index of the active tab. The
   * index is based on the tab's position when it loads.
   */
  @Output()
  public activeChange = new EventEmitter<number>();

  @ViewChild('groupContainerWrapper')
  public tabGroups: ElementRef | undefined;

  @ViewChild('skySideContent')
  public content: ElementRef | undefined;

  @ViewChild('contentContainerWrapper')
  public contentWrapper: ElementRef | undefined;

  public ariaOwns: string | undefined;

  public isMobile = false;

  protected tablistHasFocus = false;

  #ngUnsubscribe = new Subject<void>();
  #_ariaRole = 'tablist';

  #resources: SkyLibResourcesService;
  #changeRef: ChangeDetectorRef;

  constructor(
    public adapterService: SkyVerticalTabsetAdapterService,
    public tabService: SkyVerticalTabsetService,
    resources: SkyLibResourcesService,
    changeRef: ChangeDetectorRef,
    public tabIdSvc: SkyTabIdService,
  ) {
    this.#resources = resources;
    this.#changeRef = changeRef;
  }

  public ngOnInit(): void {
    this.tabService.maintainTabContent = this.maintainTabContent;

    this.tabService.indexChanged
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((index) => {
        this.activeChange.emit(index);
        if (this.contentWrapper) {
          this.adapterService.scrollToContentTop(this.contentWrapper);
        }
        this.#changeRef.markForCheck();
      });

    this.tabService.switchingMobile
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.#changeRef.markForCheck();
      });

    if (this.tabService.isMobile()) {
      this.isMobile = true;
      this.tabService.animationContentVisibleState = VISIBLE_STATE;
      this.#changeRef.markForCheck();
    }
    if (!this.showTabsText) {
      this.#resources
        .getString('skyux_vertical_tabs_show_tabs_text')
        .pipe(take(1))
        .subscribe((resource) => {
          /* sanity check */
          /* istanbul ignore else */
          if (!this.showTabsText) {
            this.showTabsText = resource;
          }
        });
    }
  }

  public ngAfterViewChecked(): void {
    this.tabService.content = this.content;
    this.tabService.updateContent();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  protected tabsetFocus(): void {
    this.tabService.focusActiveTab(this.tabGroups);
  }

  protected trapFocusInTablist(): void {
    // This will set the tab index of the the vertical tabset element to -1
    // while focus is inside the tab list, allowing Shift+Tab to move
    // to the next element above the tab list element. Otherwise focus would
    // be trapped on the currently focused tab.
    this.tablistHasFocus = true;
  }

  protected resetTabIndex(): void {
    this.tablistHasFocus = false;
  }

  protected tabGroupsArrowDown(): void {
    this.adapterService.focusNextButton(this.tabGroups);
  }

  protected tabGroupsArrowUp(): void {
    this.adapterService.focusPreviousButton(this.tabGroups);
  }
}
