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
})
export class SkyVerticalTabsetComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  /**
   * Specifies the text to display on the show tabs button on mobile devices.
   */
  @Input()
  public showTabsText: string | undefined;

  /**
   * Specifies an ARIA label for the tabset. This sets the tabset's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels
   * the tabset. This sets the tabset's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * Specifies an ARIA role for the vertical tabset
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the tabset functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
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
   * Indicates whether the vertical tabset loads tab content during initialization so that it
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
  #ngUnsubscribe = new Subject<void>();
  #_ariaRole = 'tablist';

  #resources: SkyLibResourcesService;
  #changeRef: ChangeDetectorRef;
  #tabIdSvc: SkyTabIdService;

  constructor(
    public adapterService: SkyVerticalTabsetAdapterService,
    public tabService: SkyVerticalTabsetService,
    resources: SkyLibResourcesService,
    changeRef: ChangeDetectorRef,
    tabIdSvc: SkyTabIdService
  ) {
    this.#resources = resources;
    this.#changeRef = changeRef;
    this.#tabIdSvc = tabIdSvc;

    this.#tabIdSvc.ids.pipe(takeUntil(this.#ngUnsubscribe)).subscribe((ids) => {
      this.ariaOwns = ids.join(' ') || undefined;
      this.#changeRef.markForCheck();
    });
  }

  public ngOnInit() {
    this.tabService.maintainTabContent = this.maintainTabContent;

    this.tabService.indexChanged
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((index: any) => {
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

  public ngAfterViewChecked() {
    this.tabService.content = this.content;
    this.tabService.updateContent();
  }

  public ngOnDestroy() {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
