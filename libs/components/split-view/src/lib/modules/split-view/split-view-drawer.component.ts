import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyStackingContextService,
  SkyStackingContextStratum,
} from '@skyux/core';

import { Subject, fromEvent } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

import { SkySplitViewResourcesModule } from '../shared/sky-split-view-resources.module';

import { SkySplitViewService } from './split-view.service';

let skySplitViewNextId = 0;

/**
 * Specifies the content to display in the split view's list panel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkySplitViewResourcesModule],
  selector: 'sky-split-view-drawer',
  styleUrl: './split-view-drawer.component.scss',
  templateUrl: './split-view-drawer.component.html',
})
export class SkySplitViewDrawerComponent implements OnInit, OnDestroy {
  /**
   * The ARIA label for the list panel. This sets the panel's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Sets the list panel's width in pixels.
   * @default 320
   */
  @Input()
  public set width(value: number | undefined) {
    if (value) {
      this.#_width = Number(value);
      this.#changeDetectorRef.markForCheck();
    }
  }

  public get width(): number | undefined {
    // TODO: Logic in a getter is a SKY UX anti-pattern, but fixing this would
    // require a significant amount of refactoring.
    if (this.isMobile) {
      return undefined;
    }

    if (this.#_width !== undefined) {
      if (this.#_width > this.widthMax) {
        return this.widthMax;
      } else if (this.#_width < this.widthMin) {
        return this.widthMin;
      }
    }

    return this.#_width || this.widthDefault;
  }

  public isMobile = false;

  public splitViewDrawerId: string;

  public widthDefault = 320;

  // Max needs to start as something to allow input range to work.
  // This value is updated as soon as the user takes action.
  public widthMax = 9999;

  public widthMin = 100;

  public widthTolerance = 100;

  protected zIndex = inject(SkyStackingContextService).getZIndex(
    inject(SkyStackingContextStratum),
    inject(DestroyRef),
  );

  #isDragging = false;
  #ngUnsubscribe = new Subject<void>();
  #xCoord = 0;

  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #coreAdapterService = inject(SkyCoreAdapterService);
  readonly #splitViewSvc = inject(SkySplitViewService);
  readonly #windowRef = inject(SkyAppWindowRef);

  #_width: number | undefined;

  constructor() {
    this.splitViewDrawerId = `sky-split-view-drawer-${++skySplitViewNextId}`;
  }

  public ngOnInit(): void {
    this.#setMaxWidth();

    this.#splitViewSvc.isMobileStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.#changeDetectorRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onResizeHandleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.#setMaxWidth();
    this.#isDragging = true;
    this.#xCoord = event.clientX;

    this.#coreAdapterService.toggleIframePointerEvents(false);

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        takeWhile(() => {
          return this.#isDragging;
        }),
      )
      .subscribe((moveEvent) => {
        this.onMouseMove(moveEvent);
      });

    fromEvent(document, 'mouseup')
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        takeWhile(() => {
          return this.#isDragging;
        }),
      )
      .subscribe(() => {
        this.onHandleRelease();
      });
  }

  public onMouseMove(event: MouseEvent): void {
    /* Sanity check */
    /* istanbul ignore if */
    if (!this.#isDragging || this.width === undefined) {
      return;
    }

    const offsetX = event.clientX - this.#xCoord;
    let width = this.width;

    width += offsetX;

    if (width < this.widthMin || width > this.widthMax) {
      return;
    }

    this.width = width;

    this.#xCoord = event.clientX;
    this.#changeDetectorRef.markForCheck();
  }

  public onHandleRelease(): void {
    this.#isDragging = false;
    this.#coreAdapterService.toggleIframePointerEvents(true);
    this.#changeDetectorRef.markForCheck();
  }

  public onResizeHandleChange(event: Event): void {
    this.width = +(event.target as HTMLInputElement).value;
    this.#setMaxWidth();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(): void {
    const window = this.#windowRef.nativeWindow;

    // If window size is smaller than width + tolerance, shrink width.
    if (
      !this.isMobile &&
      this.width !== undefined &&
      window.innerWidth < this.width + this.widthTolerance
    ) {
      this.width = window.innerWidth - this.widthTolerance;
    }
  }

  #setMaxWidth(): void {
    const splitView =
      this.#splitViewSvc.splitViewElementRef?.nativeElement.querySelector(
        '.sky-split-view',
      );
    this.widthMax = splitView.clientWidth - this.widthTolerance;
  }
}
