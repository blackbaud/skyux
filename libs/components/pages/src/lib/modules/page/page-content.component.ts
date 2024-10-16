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
    {
      provide: SkyMediaQueryService,
      useExisting: SkyResizeObserverMediaQueryService,
    },
  ],
})
export class SkyPageContentComponent implements OnInit, OnDestroy {
  #elementRef = inject(ElementRef);
  #mediaQueryService = inject(SkyResizeObserverMediaQueryService, {
    self: true,
  });

  public ngOnInit(): void {
    this.#mediaQueryService.observe(this.#elementRef, {
      updateResponsiveClasses: true,
    });
  }

  public ngOnDestroy(): void {
    this.#mediaQueryService.unobserve();
  }
}
