import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyResizeObserverMediaQueryService,
  SkyResizeObserverService,
} from '@skyux/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resize-observer-basic',
  templateUrl: './resize-observer-basic.component.html',
  styleUrls: ['./resize-observer-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ResizeObserverBasicComponent implements AfterViewInit, OnDestroy {
  @ViewChild('resize')
  public resizeElement: ElementRef<HTMLDivElement>;

  public width: number;
  public breakpoint: string;

  private subscriptions = new Subscription();

  readonly #skyResizeObserverService = inject(SkyResizeObserverService);
  readonly #skyResizeObserverMediaQueryService = inject(
    SkyResizeObserverMediaQueryService,
  );
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  public ngAfterViewInit(): void {
    this.#changeDetectorRef.detach();
    this.subscriptions.add(
      this.#skyResizeObserverMediaQueryService
        .observe(this.resizeElement)
        .subscribe((breakpoint) => {
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
          this.#changeDetectorRef.markForCheck();
        }),
    );
    this.subscriptions.add(
      this.#skyResizeObserverService
        .observe(this.resizeElement)
        .subscribe((value) => {
          this.width = value.contentRect.width;
          this.#changeDetectorRef.detectChanges();
        }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
