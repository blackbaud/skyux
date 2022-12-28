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

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTabIdService } from '../shared/tab-id.service';

import {
  HIDDEN_STATE,
  SkyVerticalTabsetService,
  VISIBLE_STATE,
} from './../vertical-tabset/vertical-tabset.service';

/**
 * Creates a container for the sectioned forms.
 */
@Component({
  selector: 'sky-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  styleUrls: ['./sectioned-form.component.scss'],
  providers: [SkyTabIdService, SkyVerticalTabsetService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tabEnter', [
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
export class SkySectionedFormComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  /**
   * Whether the sectioned form loads section content during initialization so that it
   * displays content without moving around elements in the content container.
   * @default false
   */
  @Input()
  public maintainSectionContent: boolean | undefined = false;

  /**
   * Fires when the active tab changes and emits the index of the active
   * section. The index is based on the section's position when the form loads.
   */
  @Output()
  public indexChanged: EventEmitter<number> = new EventEmitter();

  public ariaOwns: string | undefined;

  public ariaRole: string | undefined = 'tablist';

  @ViewChild('skySectionSideContent')
  public content: ElementRef | undefined;

  #ngUnsubscribe = new Subject<void>();

  #changeRef: ChangeDetectorRef;
  #tabIdSvc: SkyTabIdService;

  constructor(
    public tabService: SkyVerticalTabsetService,
    changeRef: ChangeDetectorRef,
    tabIdSvc: SkyTabIdService
  ) {
    this.#changeRef = changeRef;
    this.#tabIdSvc = tabIdSvc;

    this.#tabIdSvc.ids.pipe(takeUntil(this.#ngUnsubscribe)).subscribe((ids) => {
      this.ariaOwns = ids.join(' ') || undefined;
      this.#changeRef.markForCheck();
    });
  }

  public ngOnInit(): void {
    this.tabService.maintainTabContent = this.maintainSectionContent;

    this.tabService.indexChanged
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((index) => {
        this.indexChanged.emit(index);
        this.#changeRef.markForCheck();
      });

    this.tabService.switchingMobile
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        if (!mobile) {
          this.ariaRole = 'tablist';
        } else {
          this.ariaRole = undefined;
        }

        this.#changeRef.markForCheck();
      });

    if (this.tabService.isMobile()) {
      this.ariaRole = undefined;
      this.tabService.animationContentVisibleState = VISIBLE_STATE;
      this.#changeRef.markForCheck();
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

  public tabsVisible(): boolean {
    this.#changeRef.markForCheck();
    return this.tabService.tabsVisible();
  }

  public showTabs(): void {
    this.tabService.showTabs();
    this.#changeRef.markForCheck();
  }
}
