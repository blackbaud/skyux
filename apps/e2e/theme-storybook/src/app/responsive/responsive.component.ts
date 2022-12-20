import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  SkyCoreAdapterService,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-responsive',
  templateUrl: './responsive.component.html',
  styleUrls: ['./responsive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveComponent implements AfterViewInit, OnDestroy {
  @ViewChild('containers')
  public containersElement!: ElementRef;

  @ViewChildren('exampleContainer')
  public exampleContainers!: ElementRef[];

  public readonly containerBreakpoints = ['xs', 'sm', 'md', 'lg'];

  public currentContainerBreakpoint = 'xs';

  public currentScreenBreakpoint: string | undefined;

  #skyCoreAdapterService: SkyCoreAdapterService;
  #skyResizeObserverMediaQueryService: SkyResizeObserverMediaQueryService;
  #changeDetectorRef: ChangeDetectorRef;
  #subscriptions = new Subscription();

  constructor(
    skyCoreAdapterService: SkyCoreAdapterService,
    skyResizeObserverMediaQueryService: SkyResizeObserverMediaQueryService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.#skyCoreAdapterService = skyCoreAdapterService;
    this.#skyResizeObserverMediaQueryService =
      skyResizeObserverMediaQueryService;
    this.#changeDetectorRef = changeDetectorRef;
  }

  public ngAfterViewInit(): void {
    this.#changeDetectorRef.detach();
    this.exampleContainers.forEach((exampleContainer) => {
      this.#subscriptions.add(
        this.#skyResizeObserverMediaQueryService
          .observe(exampleContainer)
          .subscribe((breakpoint) => {
            this.#skyCoreAdapterService.setResponsiveContainerClass(
              exampleContainer,
              breakpoint
            );
            this.#changeDetectorRef.detectChanges();
          })
      );
    });
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public setClass(breakpoint: string) {
    this.currentContainerBreakpoint = breakpoint;
    this.#changeDetectorRef.detectChanges();
  }
}
