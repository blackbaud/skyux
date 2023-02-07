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
import { skyAnimationSlide } from '@skyux/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyVerticalTabComponent } from './vertical-tab.component';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tabset-group',
  templateUrl: './vertical-tabset-group.component.html',
  styleUrls: ['./vertical-tabset-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [skyAnimationSlide],
})
export class SkyVerticalTabsetGroupComponent implements OnInit, OnDestroy {
  /**
   * Whether to disable the ability to expand and collapse the group.
   * @default false
   */
  @Input()
  public disabled: boolean | undefined;

  /**
   * The header for the collapsible group of tabs.
   */
  @Input()
  public groupHeading: string | undefined;

  /**
   * Whether the collapsible group is expanded.
   * @default false
   */
  @Input()
  public open: boolean | undefined;

  @ContentChildren(SkyVerticalTabComponent)
  public tabs: QueryList<SkyVerticalTabComponent> | undefined;

  #ngUnsubscribe = new Subject<void>();

  #openBeforeTabsHidden: boolean | undefined = false;

  #tabService: SkyVerticalTabsetService;
  #changeRef: ChangeDetectorRef;

  constructor(
    tabService: SkyVerticalTabsetService,
    changeRef: ChangeDetectorRef
  ) {
    this.#tabService = tabService;
    this.#changeRef = changeRef;
  }

  public ngOnInit(): void {
    this.#tabService.hidingTabs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(this.tabsHidden);

    this.#tabService.showingTabs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(this.tabsShown);

    this.#tabService.tabClicked
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(this.tabClicked);
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public toggleMenuOpen(): void {
    if (!this.disabled) {
      this.open = !this.open;
    }

    this.#changeRef.markForCheck();
  }

  public subMenuOpen(): boolean {
    return !!this.tabs && this.tabs.find((t) => !!t.active) !== undefined;
  }

  public tabClicked = () => {
    this.#changeRef.markForCheck();
  };

  public tabsHidden = () => {
    // this fixes an animation bug with ngIf when the parent component goes from visible to hidden
    this.#openBeforeTabsHidden = this.open;
    this.open = false;
    this.#changeRef.markForCheck();
  };

  public tabsShown = () => {
    this.open = this.#openBeforeTabsHidden;
    this.#changeRef.markForCheck();
  };
}
