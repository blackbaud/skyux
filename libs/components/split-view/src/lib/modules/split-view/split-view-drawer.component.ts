import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  SkyCoreAdapterService,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
} from '@skyux/core';

import { Subject, fromEvent } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

import { SkySplitViewMediaQueryService } from './split-view-media-query.service';
import { SkySplitViewService } from './split-view.service';

let skySplitViewNextId = 0;

/**
 * Specifies the content to display in the split view's list panel.
 */
@Component({
  selector: 'sky-split-view-drawer',
  templateUrl: 'split-view-drawer.component.html',
  styleUrls: ['split-view-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SkyMediaQueryService,
      useExisting: SkySplitViewMediaQueryService,
    },
  ],
})
export class SkySplitViewDrawerComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  /**
   * Specifies an ARIA label for the list panel. This sets the panel's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public ariaLabel: string;

  /**
   * Sets the list panel's width in pixels.
   * @default 320
   */
  @Input()
  public set width(value: number) {
    if (value) {
      this._width = Number(value);
      this.updateBreakpoint();
      this.splitViewService.updateDrawerWidth(this._width);
      this.changeDetectorRef.markForCheck();
    }
  }

  public get width(): number {
    if (this.isMobile) {
      return undefined;
    }
    if (this._width > this.widthMax) {
      return this.widthMax;
    } else if (this._width < this.widthMin) {
      return this.widthMin;
    } else {
      return this._width || this.widthDefault;
    }
  }

  public isMobile = false;

  public splitViewDrawerId = `sky-split-view-drawer-${++skySplitViewNextId}`;

  public widthDefault = 320;

  // Max needs to start as something to allow input range to work.
  // This value is updated as soon as the user takes action.
  public widthMax = 9999;

  public widthMin = 100;

  public widthTolerance = 100;

  private isDragging = false;

  private ngUnsubscribe = new Subject<void>();

  private xCoord = 0;

  private _width: number;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private splitViewMediaQueryService: SkySplitViewMediaQueryService,
    private splitViewService: SkySplitViewService
  ) {}

  public ngOnInit(): void {
    this.setMaxWidth();

    this.splitViewService.isMobileStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeDetectorRef.markForCheck();
      });
  }

  public ngAfterViewInit(): void {
    this.updateBreakpoint();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onResizeHandleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (
      this.splitViewMediaQueryService.isWidthWithinBreakpiont(
        window.innerWidth,
        SkyMediaBreakpoints.xs
      )
    ) {
      return;
    }

    this.setMaxWidth();
    this.isDragging = true;
    this.xCoord = event.clientX;

    this.coreAdapterService.toggleIframePointerEvents(false);

    fromEvent(document, 'mousemove')
      .pipe(
        takeWhile(() => {
          return this.isDragging;
        })
      )
      .subscribe((moveEvent: any) => {
        this.onMouseMove(moveEvent);
      });

    fromEvent(document, 'mouseup')
      .pipe(
        takeWhile(() => {
          return this.isDragging;
        })
      )
      .subscribe((mouseUpEvent: any) => {
        this.onHandleRelease(mouseUpEvent);
      });
  }

  public onMouseMove(event: MouseEvent): void {
    /* Sanity check */
    /* istanbul ignore if */
    if (!this.isDragging) {
      return;
    }

    const offsetX = event.clientX - this.xCoord;
    let width = this.width;

    width += offsetX;

    if (width < this.widthMin || width > this.widthMax) {
      return;
    }

    this.width = width;

    this.xCoord = event.clientX;
    this.changeDetectorRef.markForCheck();
  }

  public onHandleRelease(event: MouseEvent): void {
    this.isDragging = false;
    this.coreAdapterService.toggleIframePointerEvents(true);
    this.changeDetectorRef.markForCheck();
  }

  public onResizeHandleChange(event: any): void {
    this.width = event.target.value;
    this.setMaxWidth();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: any): void {
    // If window size is smaller than width + tolerance, shrink width.
    if (
      !this.isMobile &&
      event.target.innerWidth < this.width + this.widthTolerance
    ) {
      this.width = event.target.innerWidth - this.widthTolerance;
    }
  }

  private updateBreakpoint(): void {
    this.splitViewMediaQueryService.setBreakpointForWidth(this.width);
    const newDrawerBreakpoint = this.splitViewMediaQueryService.current;
    this.coreAdapterService.setResponsiveContainerClass(
      this.elementRef,
      newDrawerBreakpoint
    );
  }

  private setMaxWidth(): void {
    const splitView =
      this.splitViewService.splitViewElementRef.nativeElement.querySelector(
        '.sky-split-view'
      );
    this.widthMax = splitView.clientWidth - this.widthTolerance;
  }
}
