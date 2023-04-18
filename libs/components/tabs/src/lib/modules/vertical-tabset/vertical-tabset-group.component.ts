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
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value;
    this.#slideForExpanded(false);
  }

  public get disabled(): boolean | undefined {
    return this.#_disabled;
  }

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
  public set open(value: boolean | undefined) {
    this.#_open = value;
    this.#slideForExpanded(false);
  }

  public get open(): boolean | undefined {
    return this.#_open;
  }

  @ContentChildren(SkyVerticalTabComponent)
  public tabs: QueryList<SkyVerticalTabComponent> | undefined;

  public animationDisabled = false;
  public slideDirection: 'down' | 'up' | 'void' = 'up';

  #ngUnsubscribe = new Subject<void>();

  #tabService: SkyVerticalTabsetService;
  #changeRef: ChangeDetectorRef;

  #_disabled: boolean | undefined;
  #_open: boolean | undefined;

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

  public updateSlideDirection(event: any): void {
    console.log(event);
    this.slideDirection = event.toState;
  }

  public toggleMenuOpen(): void {
    if (!this.disabled) {
      this.open = !this.open;
    }

    this.#slideForExpanded(true);
    this.#changeRef.markForCheck();
  }

  public subMenuOpen(): boolean {
    return !!this.tabs && this.tabs.find((t) => !!t.active) !== undefined;
  }

  public tabClicked = () => {
    this.#changeRef.markForCheck();
  };

  public tabsHidden = () => {
    // Angular will sometimes place the animation into the "void" state when tabs are hidden. Update our internal variable to reflect that.
    this.slideDirection = 'void';
    this.#changeRef.markForCheck();
  };

  public tabsShown = () => {
    // Set the animation back up so that the "void" state is returned to where it was prior to the tabs being hidden.
    // This will be instantaneous due to there not being a "void -> *" state on the slide animation.
    this.#slideForExpanded(true);
    this.#changeRef.markForCheck();
  };

  #slideForExpanded(animate: boolean): void {
    this.animationDisabled = !animate;
    this.slideDirection = this.open && !this.disabled ? 'down' : 'up';
  }
}
