import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyPageLayoutType } from './page-layout-type';
import { SkyPageThemeAdapterService } from './page-theme-adapter.service';

/**
 * Displays page contents using the specified layout.
 * @docsId SkyPageComponentLegacy
 * @deprecated Use the `sky-page` component in `@skyux/pages` instead.
 */
@Component({
  selector: 'sky-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  providers: [SkyPageThemeAdapterService],
  standalone: false,
})
export class SkyPageComponent implements OnInit, OnDestroy {
  /**
   * The page layout. Use `auto` to allow the page contents
   * to expand beyond the bottom of the browser window. Use `fit`
   * to constrain the page contents to the available viewport.
   */
  @Input()
  public set layout(value: SkyPageLayoutType | undefined) {
    this.#_layout = value || 'auto';
  }

  public get layout(): SkyPageLayoutType {
    return this.#_layout;
  }

  #themeAdapter: SkyPageThemeAdapterService;

  #_layout: SkyPageLayoutType = 'auto';

  #logger = inject(SkyLogService);

  constructor(themeAdapter: SkyPageThemeAdapterService) {
    this.#logger.deprecated('SkyPageComponent', {
      deprecationMajorVersion: 8,
      moreInfoUrl: 'https://developer.blackbaud.com/skyux/components/page',
      replacementRecommendation:
        'Use the `sky-page` component in `@skyux/pages` instead.',
    });

    this.#themeAdapter = themeAdapter;
  }

  public ngOnInit(): void {
    this.#themeAdapter.addTheme();
  }

  public ngOnDestroy(): void {
    this.#themeAdapter.removeTheme();
  }
}
