import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyResizeObserverMediaQueryService,
  provideSkyMediaQueryServiceOverride,
} from '@skyux/core';

/**
 * Displays page contents using spacing that corresponds to the parent
 * page's layout.
 */
@Component({
  selector: 'sky-page-content',
  template: `<ng-content />`,
  styleUrls: ['./page-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkyResizeObserverMediaQueryService,
    provideSkyMediaQueryServiceOverride(SkyResizeObserverMediaQueryService),
  ],
})
export class SkyPageContentComponent implements OnInit, OnDestroy {
  #elementRef = inject(ElementRef);
  #mediaQueryService = inject(SkyResizeObserverMediaQueryService);

  public ngOnInit(): void {
    this.#mediaQueryService.observe(this.#elementRef, {
      updateResponsiveClasses: true,
    });
  }

  public ngOnDestroy(): void {
    this.#mediaQueryService.unobserve();
  }
}
