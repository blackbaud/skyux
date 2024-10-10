import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyMediaQueryService,
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
    provideSkyMediaQueryServiceOverride(SkyResizeObserverMediaQueryService),
  ],
})
export class SkyPageContentComponent implements OnInit, OnDestroy {
  #elementRef = inject(ElementRef);

  // Inject the media query service, but assert the type as the override
  // to avoid a circular reference by DI.
  readonly #mediaQuerySvc = inject(
    SkyMediaQueryService,
  ) as unknown as SkyResizeObserverMediaQueryService;

  public ngOnInit(): void {
    this.#mediaQuerySvc.observe(this.#elementRef, {
      updateResponsiveClasses: true,
    });
  }

  public ngOnDestroy(): void {
    this.#mediaQuerySvc.unobserve();
  }
}
