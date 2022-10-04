import { Component, OnDestroy, OnInit } from '@angular/core';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';

/**
 * Sets the correct background color for a page.
 */
@Component({
  selector: 'sky-page',
  templateUrl: './page.component.html',
  providers: [SkyPageThemeAdapterService],
})
export class SkyPageComponent implements OnInit, OnDestroy {
  #themeAdapter: SkyPageThemeAdapterService;

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
