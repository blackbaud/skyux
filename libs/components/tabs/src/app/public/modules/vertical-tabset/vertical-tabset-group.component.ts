import {
  Component,
  Input,
  QueryList,
  ContentChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
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

import { SkyVerticalTabComponent } from './vertical-tab.component';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tabset-group',
  templateUrl: './vertical-tabset-group.component.html',
  styleUrls: ['./vertical-tabset-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'tabSlide', [
        transition(':enter', [
          style({
            height: '0',
            visibility: 'hidden'
          }),
          animate('150ms ease-in', style({
            height: '*',
            visibility: 'visible'
          }))
        ]),
        transition(':leave', [
          style({
            height: '*',
            visibility: 'visible'
          }),
          animate('150ms ease-in', style({
            height: '0',
            visibility: 'hidden'
          }))
        ])
      ])
    ]
})
export class SkyVerticalTabsetGroupComponent implements OnInit, OnDestroy {

  @Input()
  public groupHeading: string;

  @Input()
  public disabled: boolean;

  private _open: boolean = false;
  private _openBeforeTabsHidden: boolean = false;
  private _ngUnsubscribe = new Subject();

  public get open(): boolean {
    return !this.disabled && this._open;
  }

  @Input()
  public set open(value: boolean) {
    this._open = value;
  }

  @ContentChildren(SkyVerticalTabComponent)
  private tabs: QueryList<SkyVerticalTabComponent>;

  constructor(
    private tabService: SkyVerticalTabsetService,
    private changeRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.tabService.hidingTabs
      .takeUntil(this._ngUnsubscribe)
      .subscribe(this.tabsHidden);

    this.tabService.showingTabs
      .takeUntil(this._ngUnsubscribe)
      .subscribe(this.tabsShown);

    this.tabService.tabClicked
      .takeUntil(this._ngUnsubscribe)
      .subscribe(this.tabClicked);
  }

  public ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  public toggleMenuOpen() {
    if (!this.disabled) {
      this.open = !this.open;
    }

    this.changeRef.markForCheck();
  }

  public subMenuOpen(): boolean {
    return this.tabs && (this.tabs.find(t => t.active) !== undefined);
  }

  public tabClicked = () => {
    this.changeRef.markForCheck();
  }

  public tabsHidden = () => {
    // this fixes an animation bug with ngIf when the parent component goes from visible to hidden
    this._openBeforeTabsHidden = this.open;
    this.open = false;
    this.changeRef.detectChanges();
  }

  public tabsShown = () => {
    this.open = this._openBeforeTabsHidden;
    this.changeRef.detectChanges();
  }
}
