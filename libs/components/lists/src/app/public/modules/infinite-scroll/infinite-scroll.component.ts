// #region imports
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import 'rxjs/add/operator/takeWhile';

import {
  SkyInfiniteScrollDomAdapterService
} from './infinite-scroll-dom-adapter.service';
// #endregion

@Component({
  selector: 'sky-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkyInfiniteScrollDomAdapterService
  ]
})
export class SkyInfiniteScrollComponent implements OnInit, OnDestroy {
  @Input()
  public enabled = false;

  @Output()
  public scrollEnd = new EventEmitter<void>();

  public isWaiting = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private domAdapter: SkyInfiniteScrollDomAdapterService
  ) { }

  public ngOnInit(): void {
    // The user has scrolled to the infinite scroll element.
    this.domAdapter.scrollTo(this.elementRef)
      .takeWhile(() => this.enabled)
      .subscribe(() => {
        if (!this.isWaiting) {
          this.notifyScrollEnd();
        }
      });

    // New items have been loaded into the parent element.
    this.domAdapter.parentChanges(this.elementRef)
      .takeWhile(() => this.enabled)
      .subscribe(() => {
        this.isWaiting = false;
        this.changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.enabled = false;
  }

  public startInfiniteScrollLoad(): void {
    this.notifyScrollEnd();
  }

  private notifyScrollEnd(): void {
    this.isWaiting = true;
    this.scrollEnd.emit();
    this.changeDetector.markForCheck();
  }
}
