import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';
import { SkySectionedFormComponent, SkySectionedFormModule } from '@skyux/tabs';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resize-observer-content',
  templateUrl: './resize-observer-content.component.html',
  styleUrls: ['./resize-observer-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkySectionedFormModule],
  providers: [
    SkyResizeObserverMediaQueryService,
    {
      provide: SkyMediaQueryService,
      useClass: SkyResizeObserverMediaQueryService,
    },
  ],
})
export class ResizeObserverContentComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent | undefined;

  #subscriptions = new Subscription();

  #elementRef: ElementRef;
  #skyResizeObserverMediaQueryService: SkyResizeObserverMediaQueryService;

  constructor(
    elementRef: ElementRef,
    skyResizeObserverMediaQueryService: SkyResizeObserverMediaQueryService,
  ) {
    this.#elementRef = elementRef;
    this.#skyResizeObserverMediaQueryService =
      skyResizeObserverMediaQueryService;
  }

  public ngAfterViewInit(): void {
    this.#skyResizeObserverMediaQueryService.observe(this.#elementRef);
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent.showTabs();
  }
}
