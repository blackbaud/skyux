import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  SkyPageThemeAdapterService
} from './page-theme-adapter.service';

@Component({
  selector: 'sky-page',
  templateUrl: './page.component.html',
  providers: [SkyPageThemeAdapterService]
})
export class SkyPageComponent implements OnInit, OnDestroy {

  constructor(private themeAdapter: SkyPageThemeAdapterService) { }

  public ngOnInit(): void {
    this.themeAdapter.addTheme();
  }

  public ngOnDestroy(): void {
    this.themeAdapter.removeTheme();
  }

}
