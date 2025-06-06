import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyInfiniteScrollDomAdapterService } from './infinite-scroll-dom-adapter.service';

@Component({
  selector: 'sky-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyInfiniteScrollDomAdapterService],
  standalone: false,
})
export class SkyInfiniteScrollComponent implements OnDestroy {
  /**
   * Whether to make the infinite scroll component active when more data is available
   * to load. By default, infinite scroll is inactive and does not call the load function.
   * @default false
   */
  @Input()
  public get enabled(): boolean | undefined {
    return this.#_enabled;
  }
  public set enabled(value: boolean | undefined) {
    if (this.#_enabled !== value) {
      this.#_enabled = value;
      this.#setListeners();
    }
  }

  /**
   * Whether data is loading because of a `scrollEnd` event. Setting the property
   * to `true` disables new `scrollEnd` events from firing until it changes to `false`. If this
   * property is not specified, the infinite scroll component watches the DOM for changes
   * and fires `scrollEnd` events when changes occur on its parent DOM element. Relying
   * on this default behavior could fire an excessive number of `scrollEnd` events
   * if the DOM changes are not related to loading data, so we strongly recommend using this
   * property to explicitly set the infinite scroll's loading state.
   * @required
   */
  @Input()
  public get loading(): boolean | undefined {
    return this.#_loading;
  }

  public set loading(value: boolean | undefined) {
    this.#_loading = value;

    if (value !== undefined) {
      this.isWaiting = value;
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

  #changeDetector: ChangeDetectorRef;
  #domAdapter: SkyInfiniteScrollDomAdapterService;
  #elementRef: ElementRef;
  #ngUnsubscribe = new Subject<void>();
  #_enabled: boolean | undefined = false;
  #_loading: boolean | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    domAdapter: SkyInfiniteScrollDomAdapterService,
  ) {
    this.#changeDetector = changeDetector;
    this.#elementRef = elementRef;
    this.#domAdapter = domAdapter;
  }

  public ngOnDestroy(): void {
    this.enabled = false;
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public startInfiniteScrollLoad(): void {
    this.#notifyScrollEnd();
  }

  #notifyScrollEnd(): void {
    this.isWaiting = true;
    this.scrollEnd.emit();
    this.#changeDetector.markForCheck();
  }

  #setListeners(): void {
    if (this.enabled) {
      // The user has scrolled to the infinite scroll element.
      this.#domAdapter
        .scrollTo(this.#elementRef)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          if (!this.isWaiting && this.enabled) {
            this.#notifyScrollEnd();
          }
        });

      // New items have been loaded into the parent element.
      this.#domAdapter
        .parentChanges(this.#elementRef)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          if (!this.loading) {
            this.isWaiting = false;
            this.#changeDetector.markForCheck();
          }
        });
    } else {
      this.#ngUnsubscribe.next();
    }
  }
}
