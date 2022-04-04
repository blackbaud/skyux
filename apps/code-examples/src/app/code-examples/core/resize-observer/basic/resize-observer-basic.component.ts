import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyResizeObserverMediaQueryService,
  SkyResizeObserverService,
} from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-resize-observer-basic',
  templateUrl: './resize-observer-basic.component.html',
  styleUrls: ['./resize-observer-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeObserverBasicComponent implements AfterViewInit, OnDestroy {
  @ViewChild('resize')
  public resizeElement: ElementRef<HTMLDivElement>;

  public width: number;
  public breakpoint: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private skyResizeObserverService: SkyResizeObserverService,
    private skyResizeObserverMediaQueryService: SkyResizeObserverMediaQueryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.skyResizeObserverMediaQueryService.subscribe((breakpoint) => {
      switch (breakpoint) {
        case SkyMediaBreakpoints.xs:
          this.breakpoint = 'SkyMediaBreakpoints.xs';
          break;
        case SkyMediaBreakpoints.sm:
          this.breakpoint = 'SkyMediaBreakpoints.sm';
          break;
        case SkyMediaBreakpoints.md:
          this.breakpoint = 'SkyMediaBreakpoints.md';
          break;
        case SkyMediaBreakpoints.lg:
          this.breakpoint = 'SkyMediaBreakpoints.lg';
          break;
        default:
          this.breakpoint = '(unknown)';
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  public ngAfterViewInit(): void {
    this.skyResizeObserverService
      .observe(this.resizeElement)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.width = value.contentRect.width;
        this.changeDetectorRef.markForCheck();
      });
    this.skyResizeObserverMediaQueryService.observe(this.resizeElement);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
