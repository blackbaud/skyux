import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  AfterViewChecked,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

import { style, trigger, transition, animate } from '@angular/animations';

import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';

import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';

import {
  SkyVerticalTabsetService,
  HIDDEN_STATE,
  VISIBLE_STATE,
} from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tabset',
  templateUrl: './vertical-tabset.component.html',
  styleUrls: ['./vertical-tabset.component.scss'],
  providers: [SkyVerticalTabsetService],
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
  public showTabsText: string;

  /**
   * Specifies an ARIA label for the tabset. This sets the tabset's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset includes a visible label, use `ariaLabelledBy` instead.
   */
  @Input()
  public ariaLabel: string;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels
   * the tabset. This sets the tabset's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset does not include a visible label, use `ariaLabel` instead.
   */
  @Input()
  public ariaLabelledBy: string;

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
    if (this.isMobile) {
      return undefined;
    }
    return this._ariaRole || 'tablist';
  }
  public set ariaRole(value: string) {
    this._ariaRole = value;
  }

  /**
   * Indicates whether the vertical tabset loads tab content during initialization so that it
   * displays content without moving around elements in the content container.
   * @default 'false'
   */
  @Input()
  public maintainTabContent: boolean = false;

  /**
   * Fires when the active tab changes. Emits the index of the active tab. The
   * index is based on the tab's position when it loads.
   */
  @Output()
  public activeChange = new EventEmitter<number>();

  @ViewChild('groupContainerWrapper')
  public tabGroups: ElementRef;

  @ViewChild('skySideContent')
  public content: ElementRef;

  @ViewChild('contentContainerWrapper')
  private contentWrapper: ElementRef;

  private isMobile = false;
  private _ngUnsubscribe = new Subject();
  private _ariaRole: string;

  constructor(
    public adapterService: SkyVerticalTabsetAdapterService,
    public tabService: SkyVerticalTabsetService,
    private resources: SkyLibResourcesService,
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.tabService.maintainTabContent = this.maintainTabContent;

    this.tabService.indexChanged
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((index: any) => {
        this.activeChange.emit(index);
        if (this.contentWrapper) {
          this.adapterService.scrollToContentTop(this.contentWrapper);
        }
        this.changeRef.markForCheck();
      });

    this.tabService.switchingMobile
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeRef.markForCheck();
      });

    if (this.tabService.isMobile()) {
      this.isMobile = true;
      this.tabService.animationContentVisibleState = VISIBLE_STATE;
      this.changeRef.markForCheck();
    }
    if (!this.showTabsText) {
      this.resources
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
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
