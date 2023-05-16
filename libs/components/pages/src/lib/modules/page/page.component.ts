import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';
import { SkyPageLayoutType } from './types/page-layout-type';

const LAYOUT_CLASS_PREFIX = 'sky-page-layout-';
const LAYOUT_CLASS_DEFAULT = `${LAYOUT_CLASS_PREFIX}auto`;

/**
 * Displays page contents using the specified layout.
 */
@Component({
  selector: 'sky-page',
  template: `<ng-content />`,
  styleUrls: ['./page.component.scss'],
  providers: [SkyPageThemeAdapterService],
  encapsulation: ViewEncapsulation.None,
})
export class SkyPageComponent implements OnInit, OnDestroy {
  /**
   * The page layout. Use `auto` to allow the page contents
   * to expand beyond the bottom of the browser window. Use `fit`
   * to constrain the page contents to the available viewport.
   */
  @Input()
  public set layout(value: SkyPageLayoutType | undefined) {
    this.cssClass = value
      ? `${LAYOUT_CLASS_PREFIX}${value}`
      : LAYOUT_CLASS_DEFAULT;
  }

  @HostBinding('class')
  public cssClass = LAYOUT_CLASS_DEFAULT;

  #themeAdapter = inject(SkyPageThemeAdapterService);

  public ngOnInit(): void {
    this.#themeAdapter.addTheme();
  }

  public ngOnDestroy(): void {
    this.#themeAdapter.removeTheme();
  }
}
