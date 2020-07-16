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
  OnDestroy
} from '@angular/core';

import {
  style,
  trigger,
  transition,
  animate
} from '@angular/animations';

import {
  Subject
} from 'rxjs';

import {
  take,
  takeUntil
} from 'rxjs/operators';

import { SkyLibResourcesService } from '@skyux/i18n';

import {
  SkyVerticalTabsetService,
  HIDDEN_STATE,
  VISIBLE_STATE
} from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tabset',
  templateUrl: './vertical-tabset.component.html',
  styleUrls: ['./vertical-tabset.component.scss'],
  providers: [SkyVerticalTabsetService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'tabGroupEnter', [
        transition(`${HIDDEN_STATE} => ${VISIBLE_STATE}`, [
          style({transform: 'translate(-100%)'}),
          animate('150ms ease-in')
        ])
      ]
    ),
    trigger(
      'contentEnter', [
        transition(`${HIDDEN_STATE} => ${VISIBLE_STATE}`, [
          style({transform: 'translate(100%)'}),
          animate('150ms ease-in')
        ])
      ]
    )
  ]
})
export class SkyVerticalTabsetComponent implements OnInit, AfterViewChecked, OnDestroy {

  /**
   * Specifies the text to display on the show tabs button on mobile devices.
   */
  @Input()
  public showTabsText: string;

  /**
   * Specifies an ARIA role for the tabset to support accessibility by indicating
   * how the tabset functions and what it controls. For information about ARIA roles,
   * see the [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
   * @default "tablist"
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
   * Specifies if the vertical tabset should load tab content when tabs initialize
   * and show/hide content without moving around elements in the content container.
   */
  @Input()
  public maintainTabContent: boolean = false;

  /**
   * Fires when the active tab changes. Emits the index of the active tab. The
   * index is based on the tab's position when it loads.
   */
  @Output()
  public activeChange = new EventEmitter<number>();

  @ViewChild('contentWrapper')
  public tabGroups: ElementRef;

  @ViewChild('skySideContent')
  public content: ElementRef;

  private isMobile = false;
  private _ngUnsubscribe = new Subject();
  private _ariaRole: string;

  constructor(
    public tabService: SkyVerticalTabsetService,
    private resources: SkyLibResourcesService,
    private changeRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.tabService.maintainTabContent = this.maintainTabContent;

    this.tabService.indexChanged
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((index: any) => {
        this.activeChange.emit(index);
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
      this.resources.getString('skyux_vertical_tabs_show_tabs_text')
        .pipe(take(1))
        .subscribe(resource => {
          /* sanity check */
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
