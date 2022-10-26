import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { SkyPageLayoutType } from './page-layout-type';
import { SkyPageThemeAdapterService } from './page-theme-adapter.service';

/**
 * Displays page contents using the specified layout.
 */
@Component({
  selector: 'sky-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  providers: [SkyPageThemeAdapterService],
})
export class SkyPageComponent implements OnInit, OnDestroy {
  /**
   * Specifies the page layout. Use `auto` to allow the page contents
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

  constructor(themeAdapter: SkyPageThemeAdapterService) {
    this.#themeAdapter = themeAdapter;
  }

  public ngOnInit(): void {
    this.#themeAdapter.addTheme();
  }

  public ngOnDestroy(): void {
    this.#themeAdapter.removeTheme();
  }
}
