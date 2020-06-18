import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyInfiniteScrollDomAdapterService
} from './infinite-scroll-dom-adapter.service';

@Component({
  selector: 'sky-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkyInfiniteScrollDomAdapterService
  ]
})
export class SkyInfiniteScrollComponent implements OnDestroy {

  /**
   * Indicates whether to make the infinite scroll component active when more data is available
   * to load. By default, infinite scroll is inactive and does not call the load function.
   * @default false
   */
  @Input()
  public get enabled(): boolean {
    return this._enabled || false;
  }
  public set enabled(value: boolean) {
    if (this._enabled !== value) {
      this._enabled = value;
      this.setListeners();
    }
  }

  /**
   * Fires when scrolling triggers the need to load more data or when users select the button
   * to load more data. This event only fires when the `enabled` property is set to `true`
   * and data is not already loading.
   */
  @Output()
  public scrollEnd = new EventEmitter<void>();

  public isWaiting = false;

  private ngUnsubscribe = new Subject<void>();

  private _enabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private domAdapter: SkyInfiniteScrollDomAdapterService
  ) { }

  public ngOnDestroy(): void {
    this.enabled = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public startInfiniteScrollLoad(): void {
    this.notifyScrollEnd();
  }

  private notifyScrollEnd(): void {
    this.isWaiting = true;
    this.scrollEnd.emit();
    this.changeDetector.markForCheck();
  }

  private setListeners(): void {
    if (this.enabled) {
      // The user has scrolled to the infinite scroll element.
      this.domAdapter.scrollTo(this.elementRef)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          if (!this.isWaiting && this.enabled) {
            this.notifyScrollEnd();
          }
        });

      // New items have been loaded into the parent element.
      this.domAdapter.parentChanges(this.elementRef)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.isWaiting = false;
          this.changeDetector.markForCheck();
        });
    } else {
      this.ngUnsubscribe.next();
    }
  }
}
