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
} from '@skyux/core';

import { SkyPageLink } from '../action-hub/types/page-link';

let parentLink: SkyPageLink;

/**
 * Displays page heading's contents using spacing that corresponds to the parent page's layout
 */
@Component({
  selector: 'sky-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  providers: [
    SkyResizeObserverMediaQueryService,
    {
      provide: SkyMediaQueryService,
      useExisting: SkyResizeObserverMediaQueryService,
    },
  ],
})
export class SkyPageHeaderComponent implements OnInit, OnDestroy {
  /**
   * A link to the parent page of the current page.
   */
  @Input()
  public parentLink?: typeof parentLink;

  /**
   * The title of the current page.
   */
  @Input()
  public pageTitle!: string;

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
