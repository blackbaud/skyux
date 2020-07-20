import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input
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
  takeUntil
} from 'rxjs/operators';

import {
  SkyVerticalTabsetService,
  HIDDEN_STATE,
  VISIBLE_STATE
} from './../vertical-tabset/vertical-tabset.service';

@Component({
  selector: 'sky-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  styleUrls: ['./sectioned-form.component.scss'],
  providers: [SkyVerticalTabsetService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'tabEnter', [
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
export class SkySectionedFormComponent implements OnInit, OnDestroy, AfterViewChecked {

  /**
   * Indicates whether the sectioned form loads section content during initialization so that it
   * displays content without moving around elements in the content container.
   * @default 'false'
   */
  @Input()
  public maintainSectionContent: boolean = false;

  @Output()
  public indexChanged: EventEmitter<number> = new EventEmitter();

  public get ariaRole(): string {
    return this.isMobile ? undefined : 'tablist';
  }

  @ViewChild('skySectionSideContent')
  public content: ElementRef;

  private isMobile = false;
  private _ngUnsubscribe = new Subject();

  constructor(
    public tabService: SkyVerticalTabsetService,
    private changeRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.tabService.maintainTabContent = this.maintainSectionContent;

    this.tabService.indexChanged
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(index => {
        this.indexChanged.emit(index);
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
  }

  public ngAfterViewChecked() {
    this.tabService.content = this.content;
    this.tabService.updateContent();
  }

  public ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  public tabsVisible() {
    this.changeRef.markForCheck();
    return this.tabService.tabsVisible();
  }

  public showTabs() {
    this.tabService.showTabs();
    this.changeRef.markForCheck();
  }
}
