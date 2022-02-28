import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { SkyVerticalTabComponent } from './vertical-tab.component';

import { SkyVerticalTabsetService } from './vertical-tabset.service';
import { skyAnimationSlide } from '@skyux/animations';

@Component({
  selector: 'sky-vertical-tabset-group',
  templateUrl: './vertical-tabset-group.component.html',
  styleUrls: ['./vertical-tabset-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [skyAnimationSlide],
})
export class SkyVerticalTabsetGroupComponent implements OnInit, OnDestroy {
  /**
   * Indicates whether to disable the ability to expand and collapse the group.
   * @default false
   */
  @Input()
  public disabled: boolean;

  /**
   * Specifies the header for the collapsible group of tabs.
   */
  @Input()
  public groupHeading: string;

  /**
   * Indicates whether the collapsible group is expanded.
   * @default false
   */
  @Input()
  public set open(value: boolean) {
    this._open = value;
  }

  public get open(): boolean {
    return !this.disabled && this._open;
  }

  @ContentChildren(SkyVerticalTabComponent)
  private tabs: QueryList<SkyVerticalTabComponent>;

  private ngUnsubscribe = new Subject();

  private openBeforeTabsHidden = false;

  private _open = false;

  constructor(
    private tabService: SkyVerticalTabsetService,
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.tabService.hidingTabs
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.tabsHidden);

    this.tabService.showingTabs
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.tabsShown);

    this.tabService.tabClicked
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.tabClicked);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public toggleMenuOpen(): void {
    if (!this.disabled) {
      this.open = !this.open;
    }

    this.changeRef.markForCheck();
  }

  public subMenuOpen(): boolean {
    return this.tabs && this.tabs.find((t) => t.active) !== undefined;
  }

  public tabClicked = () => {
    this.changeRef.markForCheck();
  };

  public tabsHidden = () => {
    // this fixes an animation bug with ngIf when the parent component goes from visible to hidden
    this.openBeforeTabsHidden = this.open;
    this.open = false;
    this.changeRef.markForCheck();
  };

  public tabsShown = () => {
    this.open = this.openBeforeTabsHidden;
    this.changeRef.markForCheck();
  };
}
