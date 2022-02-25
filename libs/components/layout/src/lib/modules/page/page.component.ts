import { Component, OnDestroy, OnInit } from '@angular/core';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';

/**
 * Resets the SPA's background to white and adds the `sky-theme-default` CSS class to the host
 * element to let consumers override CSS styling. Consumers can override any element by writing
 * CSS selectors like this: `:host-context(.sky-theme-default) .my-class {}`.
 */
@Component({
  selector: 'sky-page',
  templateUrl: './page.component.html',
  providers: [SkyPageThemeAdapterService],
})
export class SkyPageComponent implements OnInit, OnDestroy {
  constructor(private themeAdapter: SkyPageThemeAdapterService) {}

  public ngOnInit(): void {
    this.themeAdapter.addTheme();
  }

  public ngOnDestroy(): void {
    this.themeAdapter.removeTheme();
  }
}
