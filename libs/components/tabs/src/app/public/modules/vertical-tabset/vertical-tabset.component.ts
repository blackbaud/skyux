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

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { SkyLibResourcesService } from '@skyux/i18n';

import {
  SkyVerticalTabsetService,
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
        transition(`void => ${VISIBLE_STATE}`, [
          style({transform: 'translate(-100%)'}),
          animate('150ms ease-in')
        ])
      ]
    ),
    trigger(
      'contentEnter', [
        transition(`void => ${VISIBLE_STATE}`, [
          style({transform: 'translate(100%)'}),
          animate('150ms ease-in')
        ])
      ]
    )
  ]
})
export class SkyVerticalTabsetComponent implements OnInit, AfterViewChecked, OnDestroy {

  @Input()
  public showTabsText: string;

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
    this.tabService.indexChanged
      .takeUntil(this._ngUnsubscribe)
      .subscribe((index: any) => {
        this.activeChange.emit(index);
        this.changeRef.markForCheck();
      });

    this.tabService.switchingMobile
      .takeUntil(this._ngUnsubscribe)
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeRef.markForCheck();
      });

    if (this.tabService.isMobile()) {
      this.isMobile = true;
      this.tabService.animationVisibleState = VISIBLE_STATE;
      this.changeRef.markForCheck();
    }
    if (!this.showTabsText) {
      this.resources.getString('skyux_vertical_tabs_show_tabs_text').take(1).subscribe(resource => {
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
