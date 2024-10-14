import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
  provideSkyMediaQueryServiceOverride,
} from '@skyux/core';

import { SkyPageLink } from '../action-hub/types/page-link';

/**
 * Displays page heading's contents using spacing that corresponds to the parent page's layout
 */
@Component({
  selector: 'sky-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  providers: [
    provideSkyMediaQueryServiceOverride(SkyResizeObserverMediaQueryService),
  ],
})
export class SkyPageHeaderComponent implements OnInit, OnDestroy {
  /**
   * A link to the parent page of the current page.
   */
  @Input()
  public parentLink?: SkyPageLink;

  /**
   * The title of the current page.
   */
  @Input()
  public pageTitle!: string;

  #elementRef = inject(ElementRef);

  readonly #mediaQuerySvc = inject(
    SkyMediaQueryService,
  ) as SkyResizeObserverMediaQueryService;

  public ngOnInit(): void {
    this.#mediaQuerySvc.observe(this.#elementRef, {
      updateResponsiveClasses: true,
    });
  }

  public ngOnDestroy(): void {
    this.#mediaQuerySvc.unobserve();
  }
}
